export interface Point {
    x: number;
    y: number;
}

export function curveTo( context: CanvasRenderingContext2D, points: Point[] ) {
    let a: Point, b: Point;
    let x: number, y: number;

    for ( var i = 1, length = points.length - 2; i < length; i++ ) {

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

export function times<T>( amount: number, fn: ( i: number ) => T ): T[] {
    return Array( amount ).fill( 0 ).map( ( _, i ) => fn( i ) );
}

export function random( from: number, to?: number ): number {
    if ( to === undefined ) {
        to = from;
        from = 0;
    }

    const value = to - from;

    return Math.round( Math.random() * value ) + from;
}

export function setLength( point: Point, value: number ) {
    const length = Math.sqrt( point.x * point.x + point.y * point.y );

    point.x = point.x / length * value;
    point.y = point.y / length * value;
}