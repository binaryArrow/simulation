export class Street {
    x1: number
    x2: number
    y1: number
    y2: number

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2
    }

    drawStreet(context: CanvasRenderingContext2D): void{
        context.lineWidth = 15
        context.beginPath()
        context.moveTo(this.x1, this.y1)
        context.lineTo(this.x2, this.y2)
        context.strokeStyle = '#000'
        context.stroke()
        context.lineWidth = 13
        context.moveTo(this.x1, this.y1)
        context.lineTo(this.x2, this.y2)
        context.strokeStyle = '#fff'
        context.stroke()
    }
}