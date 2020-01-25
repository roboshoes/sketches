import { Vector2, Box2 } from "three";

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
const vector2 = new Vector2();
const box = new Box2();
const minVector = new Vector2();
const maxVector = new Vector2();

export class Square {

    private segments: Segment[] = [];
    private offset = 100;
    private range = 50;

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

    draw( context: CanvasRenderingContext2D, t: number ): void {
        this.updateCorners( t );

        context.beginPath();
        context.lineCap = "round";

        this.segments.forEach( segment => this.drawSegment( context, segment, t ) );

        context.stroke();
        context.fill();
        context.beginPath();
    }

    private updateCorners( t: number ): void {
        this.offset = 562 * this.quadOut( t ) ;

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

    private quadOut( t: number ): number {
        return -t * ( t - 2.0 );
    }

    private subdivide( segment: Segment, direction: "x" | "y", range = 20 ): void {
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

    private drawSegment( context: CanvasRenderingContext2D, segment: Segment, t: number ): void {
        const start = segment.from;
        const end = segment.to;
        const direction = new Vector2().subVectors( end, start );

        context.moveTo( start.x, start.y );

        if ( segment.triggers.length === 0 ) {
            context.lineTo( end.x, end.y );
        } else {
            const previousOffset = new Vector2();
            const previousPoint = start.clone();

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

                const newCorner = usePoint.copy( point ).add( offset );

                minVector.copy( previousPoint ).min( newCorner );
                maxVector.copy( previousPoint ).max( newCorner );

                box.set( minVector, maxVector );

                const size = box.getSize( vector2 );

                context.rect( minVector.x, minVector.y, size.width, size.height );
                context.moveTo( newCorner.x, newCorner.y );

                previousOffset.copy( offset );
                previousPoint.copy( newCorner );
            }

            context.lineTo( end.x, end.y );
        }
    }
}
