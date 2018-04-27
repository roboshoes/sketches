import { GuideLine, TweenLine, StraightLine } from "./line";
import { quadInOut } from "eases";
import rand from "mout/random/rand";

function getSurroundingIndices( array, target ) {
    let previous;
    let next;

    for ( let i = 0; i < array.length; i++ ) {
        if ( target > array[ i ] ) {
            previous = array[ i ];
            next = array[ i + 1 ];
        } else break;
    }

    return [ previous, next ];
}

function inverseLerp( a, b, value ) {
    return ( value - a ) / ( b - a );
}

function randomInts( a, b, amount ) {
    const array = [];
    const distance = Math.round( ( b - a ) / amount );
    const quarter = distance / 4;

    for ( let i = 0; i < amount; i++ ) {
        array.push( a + Math.round( distance * ( i + 0.5 ) + rand( - quarter, quarter ) ) );
    }

    return array;
}

export class Field {
    constructor( area ) {

        const amount = 100;
        const lines = new Array( amount );
        const guideIndices = randomInts( 4, amount - 4, 7 );

        guideIndices.push( amount - 1 );
        guideIndices.unshift( 0 );

        lines[ 0 ] = new StraightLine( area, 0 );
        lines[ amount - 1 ] = new StraightLine( area, area.width );

        guideIndices.forEach( index => {
            if ( index === 0 || index === amount - 1 ) return;
            lines[ index ] = new GuideLine( area.height, area.x + area.width * index / ( amount - 1 ) );
        } );

        for ( let i = 0; i < lines.length; i++ ) {
            if ( ! lines[ i ] ) {
                let [ previous, next ] = getSurroundingIndices( guideIndices, i );

                const percent = inverseLerp( previous, next, i );
                const previousGuide = lines[ previous ];
                const nextGuide = lines[ next ];

                lines[ i ] = new TweenLine( previousGuide, nextGuide, quadInOut( percent ) );
            }
        }

        guideIndices.pop();
        guideIndices.shift();

        this.guideIndices = guideIndices;
        this.lines = lines;
    }

    render( context ) {
        this.guideIndices.forEach( i => this.lines[ i ].calculateAnchors() );
        this.lines.forEach( line => line.render( context ) );
    }
}