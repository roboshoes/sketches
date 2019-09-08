import { options, draw, getContext, bootstrap, getCanvas } from "canvas-recorder";

const context = getContext();

options( {
    size: [ 1024, 1024 ],
    clear: false,
    record: false,
    frames: 60 * 6,
} );

type vec2 = [ number, number ];

interface Circle {
    position: vec2;
    radius: number;
}

const from: Circle[] = createCircles( 100 );

const circleT: Circle = {
    position: [ 0, 0 ],
    radius: 0,
}

function renderCircle( circle: Circle ) {
    context.beginPath();
    context.arc( circle.position[ 0 ], circle.position[ 1 ], circle.radius, 0, Math.PI * 2 );
    context.closePath();
    context.fill();
}

function overlaps( circle: Circle, stack: Circle[] ): boolean {
    for ( let i = 0; i < stack.length; i++ ) {
        const other: Circle = stack[ i ];
        const x = circle.position[ 0 ] - other.position[ 0 ];
        const y = circle.position[ 1 ] - other.position[ 1 ];
        const distance = Math.sqrt( x * x + y * y );

        if ( distance < circle.radius + other.radius ) {
            return true;
        }
    }

    return false;
}

function random( from: number, to?: number | undefined ): number {
    if ( to === undefined ) {
        to = from;
        from = 0;
    }

    return from + ( to - from ) * Math.random();
}

function createCircles( amount: number ): Circle[] {
    const circles: Circle[] = [];
    let failed = 0;

    while ( circles.length < amount ) {
        const circle: Circle = {
            position: [ random( 1024 ), random( 1024 ) ],
            radius: random( 5, 100 )
        }

        if ( overlaps( circle, circles ) ) {
            failed++;

            if ( failed > 400 ) {
                break;
            }

            continue;
        }

        circles.push( circle );
    }

    return circles;
}

function lerp( from: number, to: number, t: number ): number {
    return from + ( to - from ) * t;
}

function lerpCircle( from: Circle, to: Circle, t: number, out: Circle ): Circle {
    out.radius = lerp( from.radius, to.radius, t );
    out.position[ 0 ] = lerp( from.position[ 0 ], to.position[ 0 ], t );
    out.position[ 1 ] = lerp( from.position[ 1 ], to.position[ 1 ], t );

    return out;
}

function copyCirlce( from: Circle, to: Circle ): Circle {
    to.position[ 0 ] = from.position[ 0 ];
    to.position[ 1 ] = from.position[ 1 ];
    to.radius = from.radius;

    return to;
}

function render( t: number ) {
    context.fillStyle = "white";
    context.globalCompositeOperation = "";

    for ( let i = 0; i < from.length; i++ ) {
        copyCirlce( from[ i ], circleT );
        circleT.radius -= 5;
        renderCircle( circleT );
    }

    context.globalCompositeOperation = "xor";
    context.fillStyle = "black";

    for ( let i = 0; i < from.length; i++ ) {
        lerpCircle( from[ i ], from[ ( i + 1 ) % from.length ], t, circleT );
        renderCircle( circleT );
    }

    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "white";
    context.fillRect( 0, 0, 1024, 1024 );
}

function ease( t: number ): number {
    return ( Math.cos( Math.PI * t ) + 1 ) / 2;
}

draw( ( _1, _2, t: number ) => {
    getCanvas().width = 1024;

    render( ease( t ) );
} );

bootstrap();