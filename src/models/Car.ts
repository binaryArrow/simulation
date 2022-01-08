export class Car{
    posX: number
    posY: number
    constructor(posX: number, posY: number) {
        this.posX = posX
        this.posY = posY
    }

    drawCar(context: CanvasRenderingContext2D): void {
        context.beginPath()
        context.arc(this.posX, this.posY, 10, 0, Math.PI * 2, false)
        context.fillStyle = '#000'
        context.fill()
    }
}