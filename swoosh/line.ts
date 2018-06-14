import { Vector2 } from "three";

export class Line {

    alive = true;

    private ttl: number;
    private direction = new Vector2( -1 +  Math.random() * 2, -1 +  Math.random() * 2 ).normalize();

    constructor( private position: Vector2, private creation: number ) {
        this.ttl = 1000 + Math.random() * 2000 ;
    }

    render( context: CanvasRenderingContext2D, time: number ) {
        const percent = time - this.creation / this.ttl;

        const end = this.position.clone().add( this.direction.clone().multiplyScalar( percent ) );

        context.moveTo( this.position.x, this.position.y );
        context.lineTo( end.x, end.y );
    }
}