import { TweenLite } from "gsap";

import { Color } from "../helpers/Color";
import { Line, LineOrientation } from "./Line";
import { Point } from "./Point";

const SHRINK_TIME = 300;

interface IHistoryState {
    topLeft: Point;
    bottomRight: Point;
}

export class Rectangle {

    private color = Color.random();
    private center = new Point();
    private isShrinking = false;
    private shrinkTimeout: number;
    private shrinkStart: number;
    private history: IHistoryState[] = [];

    get left(): number {
        return this.topLeft.x;
    }

    get right(): number {
        return this.bottomRight.x;
    }

    set right( value: number ) {
        this.bottomRight.x = value;
    }

    get top(): number {
        return this.topLeft.y;
    }

    get bottom(): number {
        return this.bottomRight.y;
    }

    set bottom( value: number ) {
        this.bottomRight.y = value;
    }

    get width(): number {
        return this.right - this.left;
    }

    get height(): number {
        return this.bottom - this.top;
    }

    constructor( private topLeft: Point, private bottomRight: Point, color?: Color ) {
        this.pushState();
        this.enableShrinking();

        if (color) {
            this.color = color;
        }
    }

    isIntersecting( line: Line ): boolean {
        if ( this.isPointInside( line.from ) || this.isPointInside( line.to ) ) return false;

        if ( line.orientation === LineOrientation.HORIZONTAL ) {
            return line.left < this.left && line.right > this.right &&
                   line.top > this.top && line.top < this.bottom;
        } else if ( line.orientation === LineOrientation.VERTICAL ) {
            return line.top < this.top && line.bottom > this.bottom &&
                   line.left > this.left && line.left < this.right;
        }

        return false;
    }

    isPointInside( point: Point ): boolean {
        return point.x > this.left && point.x < this.right &&
               point.y > this.top && point.y < this.bottom;
    }

    split( line: Line ): Rectangle {
        if ( !this.isIntersecting( line ) ) {
            throw new Error( "Line and rectangle are not intersecting and can't split" );
        }

        let chunk: Rectangle;

        if ( line.orientation === LineOrientation.HORIZONTAL ) {
            chunk = new Rectangle(
                new Point( this.left, line.top ),
                this.bottomRight.clone(),
                this.color.clone().shade( 0.2 )
            );

            this.bottom = line.top;
        } else {
            chunk = new Rectangle(
                new Point( line.left, this.top ),
                this.bottomRight.clone(),
                this.color.clone().shade( 0.2 )
            );

            this.right = line.left;
        }

        this.pushState();
        this.enableShrinking();

        return chunk;
    }

    reverse(): boolean {
        if ( this.history.length === 0 ) {
            return true;
        }

        const { topLeft, bottomRight } = this.history.pop();

        TweenLite.to( this.topLeft, 0.4, { x: topLeft.x, y: topLeft.y } );
        TweenLite.to( this.bottomRight, 0.4, { x: bottomRight.x, y: bottomRight.y } );

        return false;
    }

    draw( context: CanvasRenderingContext2D ) {

        if (this.isShrinking) {
            this.shrink();
        }

        context.beginPath();
        context.moveTo( this.left, this.top );
        context.lineTo( this.right, this.top );
        context.lineTo( this.right, this.bottom );
        context.lineTo( this.left, this.bottom );
        context.closePath();

        context.fillStyle = this.color.toString();
        context.fill();
    }

    private enableShrinking() {
        this.isShrinking = true;
        this.shrinkStart = Date.now();

        clearTimeout( this.shrinkTimeout );
        this.shrinkTimeout = setTimeout( () => {
            this.isShrinking = false;
        }, SHRINK_TIME );
    }

    private shrink() {
        this.updateCenter();

        [ this.topLeft, this.bottomRight ].forEach( corner => {
            const vector = Point.fromTo( corner, this.center ).multiply( 0.005 );
            corner.add( vector ).round();
        } );
    }

    private updateCenter() {
        this.center = Point
            .fromTo( this.topLeft, this.bottomRight )
            .divide( 2 )
            .add(this.topLeft)
            .round();
    }

    private pushState() {
        this.history.push( {
            bottomRight: this.bottomRight.clone(),
            topLeft: this.topLeft.clone(),
        } );
    }
}
