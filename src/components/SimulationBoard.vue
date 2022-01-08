<template>
  <div>
    <canvas ref="board" width="1000" height="600" @click="drawLine"></canvas>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Street} from "@/models/Street";

export default defineComponent({
  name: 'SimulationBoard',

  data() {
    return {
      context: {} as CanvasRenderingContext2D,
      canvasFromView: {} as HTMLCanvasElement,
      clicks: 0,
      streets: [] as Street[],
      lastMouseClickPositionX: 0,
      lastMouseClickPositionY: 0,
    }
  },
  mounted() {
    this.canvasFromView = this.$refs['board'] as HTMLCanvasElement
    this.context = this.canvasFromView.getContext('2d') as CanvasRenderingContext2D
  },
  methods: {
    drawCar(x: number, y: number) {
      this.context.beginPath()
      this.context.arc(x, y, 10, 0, Math.PI * 2, false)
      this.context.fillStyle = '#000'
      this.context.fill()
    },
    loop(x: number, y: number) {
      this.context.clearRect(0, 0, this.canvasFromView.width, this.canvasFromView.height)
      this.drawCar(x + 1, y + 1)
      setTimeout(() => this.loop(x + 1, y + 1), 100)
    },
    drawLine(event: any) {
      let rect = this.canvasFromView.getBoundingClientRect()
      this.clicks += 1
      if (this.clicks > 1) {
        this.streets.push(new Street(
            this.lastMouseClickPositionX,
            this.lastMouseClickPositionY,
            event.clientX - rect.left,
            event.clientY - rect.top))
      }
      if(this.streets.length > 0){
        this.streets.forEach(street => {
          street.drawStreet(this.context)
        })
      }
      this.lastMouseClickPositionX = event.clientX - rect.left
      this.lastMouseClickPositionY = event.clientY - rect.top
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

canvas {
  background-color: #a2b5da;
  border: 2px solid black;
  border-radius: 10px;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
