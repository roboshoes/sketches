import { Vector2 } from "three";

interface Trigger {
    value: number;
    offset: Vector2;
}

interface Segment {
    from: Vector2;
    to: Vector2;
    triggers: Trigger[];
}

function random( min: number, max: number ): number {
    return min + Math.random() * ( max - min );
}

const vector = new Vector2();

export class Square {

    private segments: Segment[] = [];
    private offset = 100;
    private range = 20;

    constructor() {
        this.segments = [ 0, 0, 0, 0 ].map( () => ( {
            from: new Vector2(),
            to: new Vector2(),
            triggers: [],
        } ) );

        this.subdivide( this.segments[ 0 ], "y", this.range );
        this.subdivide( this.segments[ 1 ], "x", this.range );
        this.subdivide( this.segments[ 2 ], "y", this.range );
        this.subdivide( this.segments[ 3 ], "x", this.range );
    }

    draw( context: CanvasRenderingContext2D, t: number ) {
        this.updateCorners( t );

        context.beginPath();
        context.lineCap = "round";

        this.segments.forEach( segment => this.drawSegment( context, segment, t ) );

        context.stroke();
        context.beginPath();
    }

    private updateCorners( t: number ) {
        this.offset = 562 * t;

        const width = 1024 + 100;
        const offset = new Vector2( 50, 50 );

        this.segments[ 0 ].from.set( this.offset, this.offset ).sub( offset );
        this.segments[ 0 ].to.set( width - this.offset, this.offset ).sub( offset );
        this.segments[ 1 ].from.set( width - this.offset, this.offset ).sub( offset );
        this.segments[ 1 ].to.set( width - this.offset, width - this.offset ).sub( offset );
        this.segments[ 2 ].from.set( width - this.offset, width - this.offset ).sub( offset );
        this.segments[ 2 ].to.set( this.offset, width - this.offset ).sub( offset );
        this.segments[ 3 ].from.set( this.offset, width - this.offset ).sub( offset );
        this.segments[ 3 ].to.set( this.offset, this.offset ).sub( offset );
    }

    private subdivide( segment: Segment, direction: "x" | "y", range = 20 ) {
        const amount = 3 + Math.round( Math.random() * 5 );

        for ( let i = 0; i < amount; i++ ) {
            const point = random( i / amount, ( i + 1 ) / amount );
            segment.triggers.push( {
                value: point,
                offset: direction === "x"
                   ? new Vector2( random( -range, range ), 0 )
                   : new Vector2( 0, random( -range, range )  ),
            } );
        }

        segment.triggers[ segment.triggers.length - 1 ].offset.set( 0, 0 );
    }

    private drawSegment( context: CanvasRenderingContext2D, segment: Segment, t: number ) {
        let start = segment.from;
        let end = segment.to;
        let direction = new Vector2().subVectors( end, start );

        context.moveTo( start.x, start.y );

        if ( segment.triggers.length === 0 ) {
            context.lineTo( end.x, end.y );
        } else {
            let previousOffset = new Vector2();

            for ( let i = 0; i < segment.triggers.length; i++ ) {
                const trigger = segment.triggers[ i ];
                const point = vector
                    .copy( start )
                    .add( direction
                        .clone()
                        .multiplyScalar( trigger.value )
                    );

                const usePoint = point.clone().add( previousOffset );
                const offset = trigger.offset.clone().multiplyScalar( 1 - t );

                context.lineTo( usePoint.x, usePoint.y );

                usePoint.copy( point ).add( offset );

                context.lineTo( usePoint.x, usePoint.y );

                previousOffset = offset;
            }

            context.lineTo( end.x, end.y );
        }
    }
}