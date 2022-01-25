<template>
  <div>
    <canvas ref="board" width="1000" height="600" @click="createStreet"></canvas>
  </div>

  <input type="checkbox" v-model="withCar2Car">
  <label>car to car communication on/off</label>
  <button class="styled-button" id="start_button" @click="start">Start</button>
  <button class="styled-button" id="car_button" @click="createCar">Add Car</button>
  <button class="styled-button" id="reset-button" @click="reset">Reset</button>
  <label>speed: </label>
  <input id="speed-input" v-model="speed" placeholder="speed">
  <label>id: </label>
  <input id="carId-input" v-model="carId" placeholder="">
  <label>distance to Car in front(meter): </label>
  <input id="carId-input" v-model="distanceToFrontCar" placeholder="">
  <table id="cars-table">
    <tr>
      <th>car id</th>
      <th>Speed</th>
      <th>distance to front car</th>
    </tr>
    <tr v-for="(car, index) in cars" :key="index">
      <td>
        {{ car.id }}
        <button id="brake-button" @click="deleteCar(index)">delete</button>
      </td>
      <td>
        {{ car.initialSpeed }}
        <button id="brake-button" @click="brake(index)">brake</button>
      </td>
      <td>
        {{ `${car.distanceToFrontCarMeter} meter safety distance` }}
      </td>
    </tr>
  </table>

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
      carId: 0,
      speed: "0",
      lastMouseClickPositionX: 0,
      lastMouseClickPositionY: 0,
      resetCar: true,
      distanceToFrontCar: "0",
      withCar2Car: false
    }
  },
  mounted() {
    this.canvasFromView = this.$refs['board'] as HTMLCanvasElement
    this.context = this.canvasFromView.getContext('2d') as CanvasRenderingContext2D
    this.loop()
  },
  methods: {
    createCar() {
      this.cars.push(new Car(
              this.carId,
              this.street.coordinates[0].x,
              this.street.coordinates[0].y,
              parseInt(this.speed),
              this.street.coordinates,
              parseFloat(this.distanceToFrontCar)
          )
      )
      this.carId++
      console.log(this.street.coordinates[0])
      console.log(this.street.coordinates[1])
      if (this.cars.length > 0)
        this.cars.forEach(car => {
          car.drawCar(this.context)
        })
    },
    deleteCar(index: number) {
      this.cars.splice(index, 1)
    },
    brake(index: number) {
      this.cars[index].brakePosition = new Coordinates(this.cars[index].posX, this.cars[index].posY)
      this.cars[index].brake = true
    }
  ,
  loop() {
    if (!this.resetCar) {
      this.context.clearRect(0, 0, this.canvasFromView.width, this.canvasFromView.height)
      if (Object.keys(this.street).length > 0)
        this.street.drawStreet(this.context)
      this.cars.forEach((car, index, carArray) => {
        let actualDistanceToFrontCar = -1
        if (carArray[index + 1]) {
          const a = car.posX - carArray[index + 1].posX
          const b = car.posY - carArray[index + 1].posY
          actualDistanceToFrontCar = Math.hypot(a, b)
        }
        // start car after input distance
        if (carArray[index + 1] && car.distanceToFrontCar > 0 && !car.startDrive) {
          const a = car.posX - carArray[index + 1].posX
          const b = car.posY - carArray[index + 1].posY
          actualDistanceToFrontCar = Math.hypot(a, b)
          if (actualDistanceToFrontCar >= car.distanceToFrontCar) {
            car.drive(this.context, actualDistanceToFrontCar, carArray[index+1].broadcast)
          }
          // look if car has a car in front
        } else if (carArray[index+1]) {
          if(this.withCar2Car){
            const broadCasts = this.cars.map((car, index) => {
              if (car.broadcast)
                return {broadCast: car.broadcast, index: index}
            })
            const foundBroadcast = broadCasts.find(broadcast => broadcast?.broadCast && broadcast.index > index)
            car.drive(this.context, actualDistanceToFrontCar, foundBroadcast?.broadCast)
          } else car.drive(this.context, actualDistanceToFrontCar, carArray[index+1].brakeLight)
        } else car.drive(this.context, actualDistanceToFrontCar)
      })
    }
    setTimeout(() => this.loop(), 100)
  },
  start() {
    this.resetCar = false
  },
  reset() {
    this.resetCar = true
    this.context.clearRect(0, 0, this.canvasFromView.width, this.canvasFromView.height)
    if (Object.keys(this.street).length > 0)
      this.street.drawStreet(this.context)
    this.cars.forEach(car => {
      car.reset()
      car.drawCar(this.context)
    })
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
})
;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#speed-input {
  width: 25px;
  margin-right: 2px;
}

#carId-input {
  width: 25px;
  margin-right: 2px;
}

#cars-table {
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 50%;
  text-align: center;

}

#cars-table td, #cars-table th {
  border: 1px solid black;
  padding: 8px;
}

#cars-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#cars-table tr:hover {
  background-color: #ddd;
}

#cars-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}

button {

}

.styled-button {
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

#car_button {
  background-color: #4CAF50;
}

#car_button:hover {
  background-color: #50d354;
}

#car_button:active {
  background-color: #50d354;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

#start_button {
  background-color: #5ca4cb;
}

#start_button:hover {
  background-color: #5eb6e8;
}

#start_button:active {
  background-color: #5eb6e8;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

#reset-button {
  background-color: darkred;
}

#reset-button:hover {
  background-color: red;
}

#reset-button:active {
  background-color: red;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}

#brake-button {
  background-color: darkred;
  padding: 9px 9px;
  font-size: 12px;
  margin: 4px;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #fff;
  border: none;
  border-radius: 15px;
}

#brake-button:hover {
  background-color: red;
}

#brake-button:active {
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
