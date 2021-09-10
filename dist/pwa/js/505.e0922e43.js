(self["webpackChunktensorflowjs_with_quasar"]=self["webpackChunktensorflowjs_with_quasar"]||[]).push([[505],{2998:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>v});var s=i(3673);const o={class:"resultFrame"},a={style:{display:"block"},ref:"video",autoplay:""},d=["width","height"];function l(e,t,i,l,r,n){const h=(0,s.up)("q-page");return(0,s.wg)(),(0,s.j4)(h,{class:"flex flex-center"},{default:(0,s.w5)((()=>[(0,s._)("div",null,[(0,s._)("div",o,[(0,s._)("video",a,null,512),(0,s._)("canvas",{style:{position:"absolute"},ref:"canvas",width:r.resultWidth,height:r.resultHeight},null,8,d)])])])),_:1})}i(71),i(7965);var r=i(9548),n=(i(5830),i(1959));i(9935);const h={name:"app",data(){return{streamPromise:null,modelPromise:null,isVideoStreamReady:!1,isModelReady:!1,initFailMessage:"",model:null,baseModel:"lite_mobilenet_v2",selectableModels:["lite_mobilenet_v2","mobilenet_v1","mobilenet_v2"],videoRatio:1,resultWidth:0,resultHeight:0,videoHeight:480,videoWidth:270}},methods:{initWebcamStream(){return navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"environment",width:{min:this.videoWidth,max:this.videoWidth},height:{min:this.videoHeight,max:this.videoHeight}}}).then((e=>{let t=this.$refs.video;try{t.srcObject=e}catch(i){t.src=URL.createObjectURL(e)}return new Promise(((e,i)=>{t.onloadedmetadata=()=>{this.videoRatio=t.offsetHeight/t.offsetWidth,window.addEventListener("resize",this.setResultSize),this.setResultSize(),this.isVideoStreamReady=!0,console.log("webcam stream initialized"),e()}}))})).catch((e=>{throw console.log("failed to initialize webcam stream",e),e})):Promise.reject(new Error("Your browser does not support mediaDevices.getUserMedia API"))},setResultSize(){let e=document.documentElement.clientWidth;this.resultWidth=Math.min(this.videoWidth,e),this.resultHeight=this.resultWidth*this.videoRatio;let t=this.$refs.video;t.width=this.resultWidth,t.height=this.resultHeight},loadModel(){return this.isModelReady=!1,this.model&&this.model.dispose(),r.load(this.baseModel).then((e=>{this.model=e,this.isModelReady=!0,console.log("model loaded")})).catch((e=>{throw console.log("failed to load the model",e),e}))},async detectObjects(){if(!this.isModelReady)return;let e=(0,n.IU)(this.model),t=await e.detect(this.$refs.video);this.renderPredictions(t),requestAnimationFrame((()=>{this.detectObjects()}))},loadModelAndStartDetecting(){this.modelPromise=this.loadModel(),Promise.all([this.streamPromise,this.modelPromise]).then((()=>{this.detectObjects()})).catch((e=>{console.log("Failed to init stream and/or model"),this.initFailMessage=e}))},setVideoOrientation(){let e=window.screen.orientation;e.type.includes("landscape")&&(this.videoHeight=270,this.videoWidth=480)},renderPredictions(e){const t=this.$refs.canvas.getContext("2d");t.clearRect(0,0,t.canvas.width,t.canvas.height),e.forEach((e=>{t.beginPath(),t.rect(...e.bbox),t.lineWidth=3,t.strokeStyle="blue",t.fillStyle="blue",t.stroke(),t.shadowColor="white",t.shadowBlur=10,t.font="24px Arial bold",t.fillText(`${e.class}`,e.bbox[0],e.bbox[1]>10?e.bbox[1]-5:10)}))},async getAccess(){try{const e=await navigator.mediaDevices.getUserMedia({audio:!1,video:!0}),t=e.getVideoTracks(),i=t[0];setTimeout((()=>{i.stop()}),3e3)}catch(e){alert(`${e.name}`),console.error(e)}}},mounted(){alert("entrouu"),this.getAccess(),this.setVideoOrientation(),this.streamPromise=this.initWebcamStream(),this.loadModelAndStartDetecting()}};var c=i(4379),m=i(7518),u=i.n(m);h.render=l;const v=h;u()(h,"components",{QPage:c.Z})},5410:()=>{},8628:()=>{},5042:()=>{}}]);