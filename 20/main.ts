interface Gate {
    y: number;
    width: number;
    color: string;
}

interface Line {
    start: Gate;
    end: Gate;
    t: number;
}

interface LineOptions {
    startOnly?: boolean;
    endOnly?: boolean;
}

const SIZE = 1024;
const config: Line[][] = [];
let lines: Line[] = [];

document.querySelectorAll( "canvas" ).forEach( e => document.body.removeChild( e ) );

const contexts: CanvasRenderingContext2D[] = [ 0, 0, 0 ].map( () => makeCanvas() );

contexts.forEach( ( _, i: number ) => {
    lines = [];

    if ( i === 0 ) {
        for ( let j = 0; j < 20; j++ ) {
            lines.push( {
                start: findSlot( "start", i  ),
                end: findSlot( "end", i ),
                t: Math.random(),
            } );
        }
    } else {
        for ( let k = 0; k < 20; k++ ) {
            lines.push( {
                start: config[ i - 1 ][ k ].end,
                end: findSlot( "end", i ),
                t: Math.random(),
            } );
        }
    }

    config.push( lines );
} );

function findSlot( site: "start" | "end", colorIndex: number ): Gate {
    let gate: Gate;

    do {
        gate = {
            y: Math.random() * SIZE,
            width: 5 + Math.random() * 150,
            color: getColor( colorIndex ),
        }
    } while ( lines.some( line => overlaps( gate, line[ site ] )) );

    return gate;
}

function overlaps( a: Gate, b: Gate ): boolean {
    return inBetween( a.y, b.y, b.y + b.width ) ||
           inBetween( a.y + a.width, b.y, b.y + b.width ) ||
           ( a.y < b.y && a.y + a.width > b.y + b.width )
}

function inBetween( value: number, a: number, b: number ) {
    return value >= a && value <= b;
}

function getColor( index: number ): string {
    const color = [ 0, 0, 0 ];

    color[ index ] = Math.round( Math.random() * 255 );

    return `rgb( ${ color.join( "," ) } )`;
}

function renderLine( context: CanvasRenderingContext2D,
                     start: Gate,
                     end: Gate,
                     t1: number,
                     t2: number,
                     options: LineOptions = {} ) {
    const length = ( t2 - t1 ) * SIZE;
    const anchorLength = length / 2;
    const gradient = context.createLinearGradient( 0, 0, SIZE, 0 );

    gradient.addColorStop( 0, start.color );
    gradient.addColorStop( 1, end.color );

    context.fillStyle = gradient;

    if ( options.startOnly ) {

        context.fillRect( 0, start.y, SIZE * t1 + 1, start.width );

    } else if ( options.endOnly ) {

        context.beginPath();
        context.moveTo( SIZE * t1, start.y );
        context.bezierCurveTo(
            SIZE * t1 + anchorLength, start.y,
            SIZE * t1 + anchorLength, end.y,
            SIZE * t1 + length, end.y
        );
        context.lineTo( SIZE, end.y );
        context.lineTo( SIZE, end.y + end.width );
        context.lineTo( SIZE * t1 + length, end.y + end.width );
        context.bezierCurveTo(
            SIZE * t1 + anchorLength, end.y + end.width,
            SIZE * t1 + anchorLength, start.y + start.width,
            SIZE * t1, start.y + start.width,
        );
        context.closePath();
        context.fill();

    } else {

        context.beginPath();
        context.moveTo( 0, start.y );
        context.lineTo( SIZE * t1, start.y );
        context.bezierCurveTo(
            SIZE * t1 + anchorLength, start.y,
            SIZE * t1 + anchorLength, end.y,
            SIZE * t1 + length, end.y,
        );
        context.lineTo( SIZE, end.y );
        context.lineTo( SIZE, end.y + end.width );
        context.lineTo( SIZE * t1 + length, end.y + end.width );
        context.bezierCurveTo(
            SIZE * t1 + anchorLength, end.y + end.width,
            SIZE * t1 + anchorLength, start.y + start.width,
            SIZE * t1, start.y + start.width,
        );
        context.lineTo( 0, start.y + start.width );
        context.closePath();
        context.fill();

    }
}

function makeCanvas(): CanvasRenderingContext2D {
    const canvas = document.createElement( "canvas" );
    const context = canvas.getContext( "2d" )!;

    canvas.width = SIZE;
    canvas.height = SIZE;

    document.body.appendChild( canvas );

    return context;
}

contexts.forEach( ( context, i ) => {
    config[ i ].forEach( ( line: Line ) => {
        renderLine( context, line.start, line.end, 0.05, 1, { startOnly: true } );
    } );

    config[ i ].forEach( ( line: Line ) => {
        renderLine( context, line.start, line.end, 0.05, 1, { endOnly: true } );
    } );
} );
