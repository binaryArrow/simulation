import {Coordinates} from "@/models/Street";

export class Car {
    id: number
    initialPosX: number
    initialPosY: number
    posX: number
    posY: number
    initialSpeed: number
    speed: number // in kmh
    convertedSpeedInPx: number // in pixel
    streets: Coordinates[]
    angle: number
    // angle for moving
    sin?: number // for X position
    cos?: number // for Y position
    count = 0
    brake = false
    brakeLength = 0
    brakePosition?: Coordinates

    constructor(id: number, posX: number, posY: number, speed: number, streets: Coordinates[]) {
        this.id = id
        this.posX = posX
        this.posY = posY
        this.initialPosX = posX
        this.initialPosY = posY
        this.speed = speed
        this.convertedSpeedInPx = speed/10
        this.initialSpeed = speed
        this.streets = streets
        this.angle = Math.atan2(
            this.streets[this.count + 1].y - this.streets[this.count].y,
            this.streets[this.count + 1].x - this.streets[this.count].x
        )
    }

    drawCar(context: CanvasRenderingContext2D): void {
        context.beginPath()
        context.arc(this.posX, this.posY, 10, 0, Math.PI * 2, false)
        context.fillStyle = '#000'
        context.fill()
        context.fillStyle = '#fff'
        context.font = 'bold 15px serif'
        context.fillText(`${this.id}`, this.posX - 5, this.posY + 6)
    }

    drive(context: CanvasRenderingContext2D): void {
        if (this.streets.length > 1 && this.count < this.streets.length - 1) {
            if(this.brake)
                this.brakeCar()
            this.angle = Math.atan2(
                this.streets[this.count + 1].y - this.streets[this.count].y,
                this.streets[this.count + 1].x - this.streets[this.count].x
            )
            this.sin = Math.sin(this.angle) * this.convertedSpeedInPx
            this.cos = Math.cos(this.angle) * this.convertedSpeedInPx
            this.posX += this.cos
            this.posY += this.sin
            const a = this.posX - this.streets[this.count + 1].x
            const b = this.posY - this.streets[this.count + 1].y
            console.log(`x: ${this.posX} y: ${this.posY}`)
            //distance between car and wall
            console.log(Math.hypot(a, b))

            // look if car is hitting a wall
            // if so change direction to next street vector
            // 10 is the radius of the car circle
            if (Math.hypot(a, b) < 10) {
                this.count++

                this.posX = this.streets[this.count].x
                this.posY = this.streets[this.count].y
            }
        }
        this.drawCar(context)
    }

    reset(): void {
        this.posX = this.initialPosX
        this.posY = this.initialPosY
        this.count = 0
        this.brake = false
        this.speed = this.initialSpeed
    }
    brakeCar(): void{
        console.log("braked!!!!")
        //Bremsbeschleunigung konstante, Siehe Ausarbeitung.
        this.convertedSpeedInPx -= 0.2777777777777778
        if(this.convertedSpeedInPx < 0){
            const a = this.brakePosition!.x - this.posX
            const b = this.brakePosition!.y - this.posY
            this.brakeLength = Math.hypot(a, b)
            console.log(`BrakeLength = ${this.brakeLength}`)
            this.convertedSpeedInPx = 0
        }
    }
}