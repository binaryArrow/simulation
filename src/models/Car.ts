import {Coordinates} from "@/models/Street";

export class Car {
    posX: number
    posY: number
    speed: number
    streets: Coordinates[]
    angle?: number
    // angle for moving
    sin?: number // for X position
    cos?: number // for Y position
    count = 0

    constructor(posX: number, posY: number, speed: number, streets: Coordinates[]) {
        this.posX = posX
        this.posY = posY
        this.speed = speed
        this.streets = streets
    }

    drawCar(context: CanvasRenderingContext2D): void {
        context.beginPath()
        context.arc(this.posX, this.posY, 10, 0, Math.PI * 2, false)
        context.fillStyle = '#000'
        context.fill()
    }

    drive(context: CanvasRenderingContext2D): void {
        if (this.streets.length > 1 && this.count < this.streets.length - 1) {
            this.angle = Math.atan2(
                this.streets[this.count + 1].y - this.streets[this.count].y,
                this.streets[this.count + 1].x - this.streets[this.count].x
            )
            this.sin = Math.sin(this.angle) * this.speed
            this.cos = Math.cos(this.angle) * this.speed
            this.posX += this.cos
            this.posY += this.sin
            const a = this.posX - this.streets[this.count + 1].x
            const b = this.posY - this.streets[this.count + 1].y
            console.log(`x: ${this.posX} y: ${this.posY}`)
            console.log(Math.hypot(a, b))

            // look if car is hitting a wall
            // if so change direction to next street vector
            if(Math.hypot(a, b) < 10){
                this.count ++

                this.posX = this.streets[this.count].x
                this.posY = this.streets[this.count].y
            }
        }
        this.drawCar(context)
    }
}