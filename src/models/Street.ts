export class Coordinates {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
export class Street {
    coordinates: Coordinates[] = []

    constructor(c: Coordinates, c2: Coordinates) {
        this.coordinates.push(c)
        this.coordinates.push(c2)
    }

    addCoordinate(c: Coordinates): void{
        this.coordinates.push(c)
    }

    drawStreet(context: CanvasRenderingContext2D): void{
        context.beginPath()
        context.moveTo(this.coordinates[0].x, this.coordinates[0].y)
        for(let i = 1; i < this.coordinates.length; i++){
            context.lineWidth = 20
            context.lineTo(this.coordinates[i].x, this.coordinates[i].y)
            context.strokeStyle = '#000'
            context.stroke()
            context.lineWidth = 17
            context.lineTo(this.coordinates[i].x, this.coordinates[i].y)
            context.strokeStyle = '#fff'
            context.stroke()
        }
    }
}