import { Vector2, Vector } from "three";
import easeIn from "eases/quad-in";
import easeOut from "eases/quad-out";

export class Line {

    alive = true;

    private ttl: number;
    private direction = new Vector2( -1 +  Math.random() * 2, -1 +  Math.random() * 2 ).normalize();

    constructor( private position: Vector2, private creation: number ) {
        this.ttl = 1000 + Math.random() * 2000 ;
    }

    render( context: CanvasRenderingContext2D, time: number ) {
        const percent = ( time - this.creation ) / this.ttl;

        if ( ! this.alive || percent > 1 ) {
            this.alive = false;
            return;
        };

        const end: Vector2 = this.position.clone();
        const start: Vector2 = this.position.clone();
        const color = Math.floor( 255 * percent );

        end.add( this.direction.clone().multiplyScalar( easeOut( percent ) * 200 ) );
        start.add( this.direction.clone().multiplyScalar( easeIn( percent ) * 100 ) );

        context.beginPath();
        context.moveTo( start.x, start.y );
        context.lineTo( end.x, end.y );
        context.strokeStyle = `rgba( 255, 172, 178, ${ 1 - percent })`;
        context.lineWidth = 10 * ( 1 - percent )
        context.lineCap = "round";
        context.stroke();
    }
}