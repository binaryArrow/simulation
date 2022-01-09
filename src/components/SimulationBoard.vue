<template>
  <div>
    <canvas ref="board" width="1000" height="600" @click="createStreet"></canvas>
  </div>
  <button @click="loop">Start</button>
  <button @click="createCar">Add Car</button>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Coordinates, Street} from "@/models/Street";
import {Car} from "@/models/Car";

export default defineComponent({
  name: 'SimulationBoard',

  data() {
    return {
      context: {} as CanvasRenderingContext2D,
      canvasFromView: {} as HTMLCanvasElement,
      clicks: 0,
      street: {} as Street,
      cars: [] as Car[],
      lastMouseClickPositionX: 0,
      lastMouseClickPositionY: 0,
    }
  },
  mounted() {
    this.canvasFromView = this.$refs['board'] as HTMLCanvasElement
    this.context = this.canvasFromView.getContext('2d') as CanvasRenderingContext2D
  },
  methods: {
    createCar(event: any) {
      let rect = this.canvasFromView.getBoundingClientRect()
      let start = new Coordinates(
          this.street.coordinates[0].x,
          this.street.coordinates[0].y
      )
      let end = new Coordinates(
          this.street.coordinates[this.street.coordinates.length - 1].x,
          this.street.coordinates[this.street.coordinates.length - 1].y
      )
      this.cars.push(new Car(this.street.coordinates[0].x, this.street.coordinates[0].y, 20, start, end))
      if (this.cars.length > 0)
        this.cars.forEach(car => {
          car.drawCar(this.context)
        })
    },
    loop() {
      this.context.clearRect(0, 0, this.canvasFromView.width, this.canvasFromView.height)
      if (Object.keys(this.street).length > 0)
        this.street.drawStreet(this.context)
      this.cars[0].posX += this.cars[0].cos!
      this.cars[0].posY += this.cars[0].sin!
      this.cars[0].drawCar(this.context)
      setTimeout(() => this.loop(), 100)
    },
    createStreet(event: any) {
      let rect = this.canvasFromView.getBoundingClientRect()
      this.clicks += 1
      if (this.clicks > 1) {
        // last Coordinate
        let coordinate1: Coordinates = new Coordinates(
            this.lastMouseClickPositionX,
            this.lastMouseClickPositionY)
        // actual coordinate
        let coordinate2: Coordinates = new Coordinates(
            event.clientX - rect.left,
            event.clientY - rect.top
        )
        if (Object.keys(this.street).length > 0) {
          this.street.addCoordinate(coordinate2)
        } else {
          this.street = new Street(coordinate1, coordinate2)
        }
      }
      if (Object.keys(this.street).length > 0)
        this.street.drawStreet(this.context)

      this.lastMouseClickPositionX = event.clientX - rect.left
      this.lastMouseClickPositionY = event.clientY - rect.top
    },
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
