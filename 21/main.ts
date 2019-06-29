import { bootstrap, draw, options } from "canvas-recorder";

import { curveTo, Point, times, random, setLength } from "./utils";

class Line {
    private anchors: Point[] = [];
    private adjustedAnchors: Point[] = [];
    private length = 0;
    private start = 0;
    private distance = 1024;
    private round = 0;
    private jointLength = 10;

    constructor( x: number ) {
        for ( let i = 0; i < random( 5, 60 ); i++ ) {
            this.anchors.push( { x, y: this.jointLength * i } );
            this.length = 40 * i;
        }

        this.round = 1024 + this.length;
        this.distance = this.round * random( 1, 4 );
        this.start = -this.length;
        this.start = random( - this.length, 1024 );
        this.adjustedAnchors = this.anchors.map( p => ( { ...p } ) );
    }

    draw( context: CanvasRenderingContext2D, t: number, circles: Circle[] ) {
        this.update( t );
        this.updateAdjustedAnchors( circles );

        const { x, y } = this.adjustedAnchors[ 0 ];

        context.moveTo( x, y );

        curveTo( context, this.adjustedAnchors );
    }

    private update( t: number) {

        for ( let i = 0; i < this.anchors.length; i++ ) {
            this.anchors[ i ].y = this.start + t * this.distance + i * this.jointLength;
        }

        while ( this.anchors[ 0 ].y > 1024 ) {
            for ( let i = 0; i < this.anchors.length; i++ ) {
                this.anchors[ i ].y -= this.round;
            }
        }
    }

    private updateAdjustedAnchors( circles: Circle[] ) {
        const fromCenter: Point = { x: 0, y: 0 };

        for ( let i = 0; i < circles.length; i++ ) {
            const circle = circles[ i ];

            for ( let k = 0; k < this.anchors.length; k++ ) {
                if ( i === 0 ) {
                    this.adjustedAnchors[ k ].x = this.anchors[ k ].x + random( -2, 2 );
                    this.adjustedAnchors[ k ].y = this.anchors[ k ].y;
                }

                const anchor = this.adjustedAnchors[ k ];

                fromCenter.x = anchor.x - circle.center.x;
                fromCenter.y = anchor.y - circle.center.y;

                const distance = Math.sqrt( fromCenter.x * fromCenter.x + fromCenter.y * fromCenter.y );
                const useRadius = Math.abs( anchor.x - circle.center.x );

                if ( distance < circle.radius ) {
                    setLength( fromCenter, circle.radius + useRadius );

                    anchor.x = circle.center.x + fromCenter.x;
                    anchor.y = circle.center.y + fromCenter.y;
                }
            }
        }
    }
}

class Circle {
    center: Point;
    radius: number;

    private distance: number;
    private start: number;

    constructor() {
        this.center = {
            x: random( 1024 ),
            y: random( 1024 ),
        }

        this.radius = random( 50, 100 );
        this.distance = 1024 + this.radius * 2;
        this.start = random( -this.radius, 1024 + this.radius );
    }

    update( t: number ) {
        this.center.y = this.start - t * this.distance;

        if ( this.center.y < -this.radius ) {
            this.center.y += this.distance;
        }
    }
}

const lines = times( 300, _ => new Line( random( 1024 ) ) );
const circles: Circle[] = [];

function overlaps( circle: Circle ): boolean {
    for ( let i = 0 ; i < circles.length; i++ ) {
        const x = circle.center.x - circles[ i ].center.x;
        const y = circle.center.y - circles[ i ].center.y;
        const length = Math.sqrt( x * x + y * y );

        if ( length < circle.radius + circles[ i ].radius ) {
            return true;
        }
    }

    return false;
}

while ( circles.length < 20 ) {

    const circle = new Circle();

    while ( overlaps( circle ) ) {
        circle.center.x = random( 1024 )
        circle.center.y = random( 1024 )
    }

    circles.push( circle );
}

options( {
    size: [ 1024, 1024 ],
    record: false,
    frames: 60 * 6,
    clear: true,
    color: "white",
} )

draw( ( context: CanvasRenderingContext2D, _, t: number ) => {
    context.beginPath();

    circles.forEach( circle => circle.update( t ) );
    lines.forEach( line => line.draw( context, t, circles ) );

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.lineCap = "square";
    context.stroke();

    circles.forEach( circle => {
        const { x, y } = circle.center;

        context.beginPath();
        context.moveTo( x, y  );
        context.arc( x, y , 10, 0, Math.PI * 2 );
        context.fillStyle = "red";
        context.fill();
    } );
} );

bootstrap();
