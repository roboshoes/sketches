import { Circle, InterpolatedCircle } from "./circle";
import { Drawable } from "./shared";

export class Container implements Drawable {

    readonly circles: InterpolatedCircle[] = [];
    readonly outer = new Circle( 300 );
    readonly inner = new Circle( 20 );

    constructor() {

        for ( let i = 1; i < this.outer.anchors.length; i += 2 ) {
            this.outer.anchors[ i ].updateDistance( Math.sqrt( 2 ) * 300 );
        }

        this.outer.anchors.forEach( anchor => anchor.updateLegPercent( 0 ) );

        const amount = 10;

        for ( let i = 0; i < amount; i++ ) {
            this.circles.push( new InterpolatedCircle( this.outer, this.inner, i / ( amount - 1 ) ) );
        }
    }

    draw( context: CanvasRenderingContext2D ): void {
        this.circles.forEach( circle => circle.draw( context ) );
    }

}
