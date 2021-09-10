<template>
  <q-page class="flex flex-center">
    <div>
      <div class="resultFrame">
        <video style="display: block;" ref="video" autoplay></video>
        <canvas style="position: absolute" ref="canvas" :width="resultWidth" :height="resultHeight"></canvas>
      </div>

      <!-- <select v-model="baseModel" @change="loadModelAndStartDetecting">
        <option
          v-for="modelName in selectableModels"
          :key="modelName"
          :value="modelName">
            {{ modelName }}
        </option>
      </select> -->
    </div>
  </q-page>
</template>

<script>
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs-backend-webgl';
import { toRaw } from 'vue'
import '@tensorflow/tfjs-backend-cpu';

export default {
  name: 'app',

  data () {
    return {
      streamPromise: null,
      modelPromise: null,

      isVideoStreamReady: false,
      isModelReady: false,
      initFailMessage: '',

      model: null,
      baseModel: 'lite_mobilenet_v2',
      selectableModels: ['lite_mobilenet_v2', 'mobilenet_v1', 'mobilenet_v2'],

      videoRatio: 1,
      resultWidth: 0,
      resultHeight: 0,
      videoHeight: 480,
      videoWidth: 270,
    }
  },

  methods: {
    initWebcamStream () {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        alert("has camera")
        return navigator.mediaDevices.getUserMedia({
          audio: false, 
          video: { 
            facingMode: 'environment' ,
            width: { min: this.videoWidth, max: this.videoWidth },
            height: { min: this.videoHeight, max: this.videoHeight},
          }
        })
          .then(stream => {
            let video = this.$refs.video
            try {
              video.srcObject = stream
            } catch (error) {
              video.src = URL.createObjectURL(stream)
            }
            return new Promise((resolve, reject) => {
              video.onloadedmetadata = () => {
                this.videoRatio = video.offsetHeight / video.offsetWidth
                window.addEventListener('resize', this.setResultSize)
                this.setResultSize()

                this.isVideoStreamReady = true
                console.log('webcam stream initialized')
                resolve()
              }
            })
          })
          .catch(error => {
            console.log('failed to initialize webcam stream', error)
            throw (error)
          })
      } else {
        alert("no camera")
        return Promise.reject(new Error('Your browser does not support mediaDevices.getUserMedia API'))
      }
    },

    setResultSize () {
      let clientWidth = document.documentElement.clientWidth

      this.resultWidth = Math.min(this.videoWidth, clientWidth)
      this.resultHeight = this.resultWidth * this.videoRatio

      let video = this.$refs.video
      video.width = this.resultWidth
      video.height = this.resultHeight
    },

    loadModel () {
      this.isModelReady = false
      if (this.model) this.model.dispose()
      return cocoSsd.load(this.baseModel)
        .then(model => {
          this.model = model
          this.isModelReady = true
          console.log('model loaded')
        })
        .catch((error) => {
          console.log('failed to load the model', error)
          throw (error)
        })
    },

    async detectObjects () {
      if (!this.isModelReady) return
      let raw_model = toRaw(this.model)
      let predictions = await raw_model.detect(this.$refs.video)
      this.renderPredictions(predictions)
      requestAnimationFrame(() => {
        this.detectObjects()
      })
    },

    loadModelAndStartDetecting () {
      this.modelPromise = this.loadModel()
     
      Promise.all([this.streamPromise, this.modelPromise])
        .then(() => {
          this.detectObjects()
        }).catch((error) => {
          console.log('Failed to init stream and/or model')
          this.initFailMessage = error
        })
    },

    setVideoOrientation(){
      let orientation = window.screen.orientation

      if(orientation.type.includes("landscape")){
        this.videoHeight = 270
        this.videoWidth = 480
      }
    },

    renderPredictions (predictions) {
      
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      predictions.forEach(prediction => {
        // console.log(prediction.class)
        ctx.beginPath()
        ctx.rect(...prediction.bbox)
        ctx.lineWidth = 3
        ctx.strokeStyle = 'blue'
        ctx.fillStyle = 'blue'
        ctx.stroke()
        ctx.shadowColor = 'white'
        ctx.shadowBlur = 10
        ctx.font = '24px Arial bold'
        ctx.fillText(
          `${prediction.class}`,
          prediction.bbox[0],
          prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10)
      })
      
    }
  },

  mounted () {
    this.setVideoOrientation()
    this.streamPromise = this.initWebcamStream()
    this.loadModelAndStartDetecting()
  }
}

</script>

<style lang="scss">
body {
  margin: 0;
}
.resultFrame {
  video {
    min-width: 100%; 
    min-height: 100%; 
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  canvas {
    min-width: 100%; 
    min-height: 100%; 
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}

</style>
