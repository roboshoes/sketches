import Simplex from "fast-simplex-noise";
import { cubicIn } from "eases";

import { HEIGHT, WIDTH, MAX_CELL_RADIUS } from "./constants";
import { getGray } from "./utils";

interface Coord {
    readonly x: number;
    readonly y: number;
}

interface Cell extends Coord {
    readonly value: number;
}

interface Bubble extends Cell {
    readonly radius: number;
}

export class Grid {
    private readonly simplex = new Simplex( { min: 0, max: 1, frequency: 0.07 } );
    private values: number[][];
    private bubbles: Bubble[];

    constructor( public readonly size: number ) {
        this.calculateNoise();
        this.calculateBlobs();
    }

    private calculateNoise() {
        this.values = [];

        this.allCells( ( x, y ) => {
            if ( !this.values[ x ] ) this.values[ x ] = [];
            this.values[ x ][ y ] = this.simplex.scaled2D( x, y );
        } );
    }

    // Don't do this too often. It's kind of slow.
    private calculateBlobs() {
        const cells: Cell[] = [];

        this.allCells( ( x, y ) => {
            cells.push( {
                x,
                y,
                value: this.values[ x ][ y ]
            } );
        } );

        cells.sort( ( a: Cell, b: Cell ) => b.value - a.value );

        this.bubbles = [];

        let index = 0;

        while ( cells.length > 0 && index < cells.length ) {
            const center = cells[ index ];
            const range = MAX_CELL_RADIUS * cubicIn(center.value);
            const rangeInt = Math.ceil( range );

            let wantCells: Coord[] = [];

            for ( let x = Math.round( center.x - rangeInt ); x <= Math.round( center.x + rangeInt ); x++ )
            for ( let y = Math.round( center.y - rangeInt ); y <= Math.round( center.y + rangeInt ); y++ ) {
                if ( x < 0 || y < 0 || x > this.size || y > this.size ) continue;
                wantCells.push( { x, y } );
            }

            let deleteIndices: number[] = [ index ];

            for ( let i = 1; i < cells.length; i++ ) {
                const cell = cells[ i ];

                wantCells = wantCells.filter( coord => {
                    if ( coord.x === cell.x && coord.y === cell.y ) {
                        deleteIndices.push( i );
                        return false;
                    }

                    return true;
                } );
            }

            // If all cells we want are gone, it's a valid bubble. We can add it and remove
            // those cells from the cells list.
            if ( wantCells.length === 0 ) {

                this.bubbles.push( {
                    ...center,
                    radius: Math.max( range, 0.1 )
                } );

                deleteIndices.sort( ( a, b ) => a - b ).forEach( k => {
                    cells.splice( k, 1 );
                } );

                index = 0;
            } else {
                index++;
            }
        }
    }

    private allCells( callback: ( x: number, y: number ) => void ) {
        for ( let y = 0; y < this.size; y++ )
        for ( let x = 0; x < this.size; x++ )
            callback( x, y );
    }

    fill( context: CanvasRenderingContext2D ) {
        const blockSize = [ WIDTH / this.size, HEIGHT / this.size ];

        this.allCells( ( x, y ) => {
            context.fillStyle = getGray( this.values[ x ][ y ] );
            context.fillRect( x * blockSize[ 0 ], y * blockSize[ 1 ], blockSize[ 0 ], blockSize[ 1 ] );
        } );
    }

    drawBubbles( context: CanvasRenderingContext2D ) {

        const size = [ WIDTH / this.size, HEIGHT / this.size ];

        this.bubbles.forEach( bubble => {
            context.moveTo( bubble.x * size[ 0 ] + bubble.radius * size[ 0 ], bubble.y * size[ 1 ] )
            context.arc( bubble.x * size[ 0 ], bubble.y * size[ 1 ], bubble.radius * size[ 0 ], 0, Math.PI * 2 );
        } );

        context.fillStyle = "red";
        context.fill();
    }

    drawGuides( context: CanvasRenderingContext2D ) {
        context.beginPath();
        context.translate( 0.5, 0.5 );
        context.lineWidth = 1;
        context.strokeStyle = "#bbb";

        const step = [ WIDTH / this.size, HEIGHT / this.size ];
        const steps = Math.max( WIDTH / step[ 0 ], HEIGHT / step[ 1 ] );

        for ( let i = 0; i < steps + 1; i++ ) {
            if ( i * step[ 0 ] <= WIDTH ) {
                context.moveTo( i * step[ 0 ], 0 );
                context.lineTo( i * step[ 0 ], HEIGHT );
            }

            if ( i * step[ 1 ] <= HEIGHT ) {
                context.moveTo( 0, i * step[ 1 ] );
                context.lineTo( WIDTH, i * step[ 1 ] );
            }
        }

        context.stroke();
        context.translate( -0.5, -0.5 );
    }
}