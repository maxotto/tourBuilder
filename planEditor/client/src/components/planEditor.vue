<template>
  <div class="hello" style="background-color: lightblue">
    <h1>Floor is {{ floor }}</h1>
    {{xmlData}}
    <div>
    <canvas class="image-input__canvas"
        ref="canvas"
        v-bind:height="height"
        v-bind:width="width"
        v-bind:class="{ 'is-draggable': hoverIsDraggable }">
    </canvas>
    </div>
  </div>
</template>

<script>
// todo https://codepen.io/dannyrb/pen/ZLWVBq
export default {
  name: 'planEditor',
  props: {
    floor: String,
    xmlData: Object,
  },
  data: function () {
    return {
      hoverIsDraggable: false,
      width: 200,
      height: 300,  
      ctx: null, 
      canvas: null,
      img: null, 
      hotspots: [],
      radars: [],
    }
  },
  watch:{
      floor(val){
          alert('Need to load the picture: ' + this.xmlData[this.floor]['image']);
      }
  },
  mounted: function(){
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.img = document.createElement("img");
    var grd = this.ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(10, 10, 150, 80); 
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(200, 100);
    this.ctx.stroke(); 
  }
}
</script>
