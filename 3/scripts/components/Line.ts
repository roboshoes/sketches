import { Point } from "./Point";

export enum LineOrientation {
    VERTICAL,
    HORIZONTAL
}

export class Line {
    protected _orientation: LineOrientation;

    get orientation(): LineOrientation {
        return this._orientation;
    }

    get left(): number {
        return Math.min( this.from.x, this.to.x );
    }

    get right(): number {
        return Math.max( this.from.x, this.to.x );
    }

    get top(): number {
        return Math.min( this.from.y, this.to.y );
    }

    get bottom(): number {
        return Math.max( this.from.y, this.to.y );
    }

    get length(): number {
        const x = this.to.x - this.from.x;
        const y = this.to.y - this.from.y;

        return Math.sqrt( x * x + y * y );
    }

    constructor( public from: Point, public to: Point ) {

        if ( from.y === to.y ) {
            this._orientation = LineOrientation.HORIZONTAL;
        } else if ( from.x === to.x ) {
            this._orientation = LineOrientation.VERTICAL;
        } else {
            throw new Error(`
                Line orientation is not allowed.
                Ever line must be be parallel to either x or y axis.
            `);
        }
    }

    static createFromPoint( point: Point, orientation: LineOrientation, length?: number ): Line {
        if ( !length ) {
            length = Math.max( window.innerHeight, window.innerWidth );
        }

        return orientation === LineOrientation.HORIZONTAL ?
            new Line( new Point( 0, point.y ), new Point( length, point.y ) ) :
            new Line( new Point( point.x, 0 ), new Point( point.x, length ) );
    }

    draw( context: CanvasRenderingContext2D ) {
        context.beginPath();
        context.moveTo( this.from.x, this.from.y );
        context.lineTo( this.to.x, this.to.y );

        context.strokeStyle = "white";
        context.lineWidth = 3;
        context.stroke();
    }
}

export class GrowLine extends Line {
    protected _dead = false;

    private direction: Point;
    private maxGrowth: number;

    get dead(): boolean {
        return this._dead;
    }

    constructor( startPoint: Point, orientation: LineOrientation, speed = 1 ) {
        super(
            startPoint,
            startPoint
                .clone()
                .add( GrowLine.orientationToDirection( orientation ) )
        );

        this.direction = GrowLine.orientationToDirection( orientation ).multiply( speed );
        this.maxGrowth = orientation === LineOrientation.VERTICAL ?
            window.innerWidth :
            window.innerHeight;
    }

    private static orientationToDirection( orientation: LineOrientation ): Point {
        return ( orientation === LineOrientation.VERTICAL ?
            Point.VERTICAL_IDENTITY :
            Point.HORIZONTAL_IDENTITY )
                .clone()
                .multiply( 10 );
    }

    update() {
        this.to.add( this.direction );

        if ( this.length > this.maxGrowth ) {
            this._dead = true;
        }
    }
}
