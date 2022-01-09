import {Coordinates} from "@/models/Street";

export class Car{
    posX: number
    posY: number
    speed: number
    start?: Coordinates
    end?: Coordinates
    angle?: number
    sin?: number
    cos?: number
    constructor(posX: number, posY: number, speed: number, start?: any, end?: any) {
        this.posX = posX
        this.posY = posY
        this.speed = speed
        this.start = start
        this.end = end
        if(this.end && this.start) {
            this.angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x)
            this.sin = Math.sin(this.angle) * this.speed
            this.cos = Math.cos(this.angle) * this.speed
        }
    }

    drawCar(context: CanvasRenderingContext2D): void {
        context.beginPath()
        context.arc(this.posX, this.posY, 10, 0, Math.PI * 2, false)
        context.fillStyle = '#000'
        context.fill()
    }
}