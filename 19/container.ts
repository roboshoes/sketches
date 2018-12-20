import { Circle, InterpolatedCircle, Square, Blob } from "./shape";
import { Drawable } from "./shared";

export class Container implements Drawable {

    readonly circles: InterpolatedCircle[] = [];
    readonly square = new Square( 512 );
    readonly blob = new Blob( 200, 400 );
    readonly inner = new Circle( 5 );

    constructor() {

        const amount = 15;

        for ( let i = 0; i < amount; i++ ) {
            this.circles.push( new InterpolatedCircle( this.square, this.blob, i / ( amount - 1 ) ) );
        }

        for ( let i = 0; i < amount; i++ ) {
            this.circles.push( new InterpolatedCircle( this.blob, this.inner, i / ( amount - 1 ) ) );
        }
    }

    update( t: number ): void {
        this.blob.update( t );
        this.circles.forEach( c => c.update() );
    }

    draw( context: CanvasRenderingContext2D ): void {
        this.circles.forEach( circle => circle.draw( context ) );
    }

}
