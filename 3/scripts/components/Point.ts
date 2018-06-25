export class Point {
    static readonly VERTICAL_IDENTITY = new Point( 0, 1 );
    static readonly HORIZONTAL_IDENTITY = new Point( 1, 0 );

    constructor( public x: number = 0, public y: number = 0 ) {}

    static fromTo( from: Point, to: Point ): Point {
        return new Point( to.x - from.x, to.y - from.y );
    }

    add( point: Point ): this {
        this.x += point.x;
        this.y += point.y;

        return this;
    }

    multiply( value: number ): this {
        this.x *= value;
        this.y *= value;

        return this;
    }

    divide( value: number ): this {
        this.x /= value;
        this.y /= value;

        return this;
    }

    equals( other: Point ): boolean {
        return other.x === this.x && other.y === this.y;
    }

    set( x: number, y: number ): this {
        this.x = x;
        this.y = y;

        return this;
    }

    round(): this {
        this.x = Math.round( this.x );
        this.y = Math.round( this.y );

        return this;
    }

    clone(): Point {
        return new Point( this.x, this.y );
    }
}
