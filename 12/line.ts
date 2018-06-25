import easeIn from "eases/quad-in";
import easeOut from "eases/quad-out";
// @ts-ignore
import { Noise } from "noisejs";
import { Vector2 } from "three";

export class Line {

    alive = true;

    private ttl: number = 1000 + Math.random() * 3000;
    private direction = new Vector2( -1 +  Math.random() * 2, -1 +  Math.random() * 2 ).normalize();
    private trajectory: Vector2[] = [];

    constructor( private position: Vector2, private creation: number ) {
        const noise = new Noise( creation );

        for ( let i = 0; i < 100; i++ ) {
            const step = i / 100;
            this.trajectory.push(
                new Vector2(
                    position.x + noise.simplex2( position.x + i / 2, position.y ) * ( 100 * step ),
                    position.y + noise.simplex2( position.x, position.y + i / 2 ) * ( 100 * step )
                )
            );
        }
    }

    render( context: CanvasRenderingContext2D, time: number ) {
        const percent = ( time - this.creation ) / this.ttl;

        if ( ! this.alive || percent > 1 ) {
            this.alive = false;
            return;
        };

        const end: Vector2 = this.position.clone();
        const start: Vector2 = this.position.clone();

        end.add( this.direction.clone().multiplyScalar( easeOut( percent ) * 200 ) );
        start.add( this.direction.clone().multiplyScalar( easeIn( percent ) * 100 ) );

        context.beginPath();

        this.curveTo(context, this.trajectory, Math.max( 3, Math.ceil( percent * this.trajectory.length ) ) );

        context.strokeStyle = `rgba( 255, 172, 178, ${ 1 - percent })`;
        context.lineWidth = 10 * ( 1 - percent )
        context.lineCap = "round";
        context.stroke();
    }

    private curveTo( context: CanvasRenderingContext2D, points: Vector2[], limit?: number ) {
        let a: Vector2, b: Vector2;
        let x: number, y: number;

        if ( ! limit ) {
            limit = points.length;
        }

        for ( var i = 1, length = limit - 2; i < length; i++ ) {

            a = points[ i ];
            b = points[ i + 1 ];

            x = ( a.x + b.x ) * 0.5;
            y = ( a.y + b.y ) * 0.5;

            context.quadraticCurveTo( a.x, a.y, x, y );
        }

        a = points[ i ];
        b = points[ i + 1 ];

        context.quadraticCurveTo( a.x, a.y, b.x, b.y );
    }
}