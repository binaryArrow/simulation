<template>
  <div>
    <canvas ref="board" width="1000" height="600" @click="createStreet"></canvas>
  </div>
  <div class="modal-container">

  </div>
  <button class="start_button" @click="loop">Start</button>
  <button class="car_button" @click="createCar">Add Car</button>
  <input v-model="speed" placeholder="speed">

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
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
      speed: 0,
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
      this.cars.push(new Car(
          this.street.coordinates[0].x,
          this.street.coordinates[0].y,
          this.speed,
          this.street.coordinates
          )
      )
      console.log(this.street.coordinates[0])
      console.log(this.street.coordinates[1])
      if (this.cars.length > 0)
        this.cars.forEach(car => {
          car.drawCar(this.context)
        })
    },
    loop() {
      this.context.clearRect(0, 0, this.canvasFromView.width, this.canvasFromView.height)
      if (Object.keys(this.street).length > 0)
        this.street.drawStreet(this.context)
      this.cars.forEach(car => {
        car.drive(this.context)
      })
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
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

button {
  padding: 13px 18px;
  font-size: 19px;
  margin: 4px;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #fff;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}

.car_button{
  background-color: #4CAF50;
}
.car_button:hover {
  background-color: #50d354;
}
.car_button:active{
  background-color: #50d354;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

.start_button{
  background-color: #5ca4cb;
}
.start_button:hover{
  background-color: #5eb6e8;
}
.start_button:active{
  background-color: #5eb6e8;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
#cancel-button{
  background-color: darkred;
}
#cancel-button:hover{
background-color: red;
}
#cancel-button:active{
  background-color: red;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

canvas {
  background-color: #a2b5da;
  border: 2px solid black;
  border-radius: 10px;
}

.modal-container {
  grid-column: 2;
  grid-row: 2;
}

.modal-content {
  top: 40px;
  background: #ffffff;
  width: 400px;
  border-radius: 10px;
  border: 2px solid black;
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
