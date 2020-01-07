export function bezier( context, points ) {

    const length = points.length - 2;
    let a, b, x, y, i;

    for ( i = 1; i < length; i++ ) {

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