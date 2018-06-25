import ease from "eases/expo-in-out";
import { random } from "lodash";
import { Vector2 } from "three";

interface Section {
    readonly start: number;
    readonly upperStart: number;
    readonly height: number;
    readonly multiplier: number;
    readonly mutliplierT: number;
    useHeight: number;
    useStart: number;
}

export class Column {

    private sections: Section[] = [];

    constructor( public readonly position: Vector2, public readonly size: Vector2 ) {
        const amount = Math.floor( random( 3, 17 ) );

        let limit = 0;
        let i = 0;

        while ( limit < this.size.height ) {
            const buffer = random( 10, 30 );
            const start = limit + buffer;
            const height = random( 4, 150 );

            this.sections.push( {
                start,
                height,
                useStart: start,
                useHeight: height,
                upperStart: random( start, start + height - 2 ),
                multiplier: Math.trunc( random( 1, 6 ) ),
                mutliplierT: Math.trunc( random( 1, 4 ) ),
            } );

            limit += height + buffer;
            i++;
        }
    }

    calculate( t: number ) {
        this.sections.forEach( ( section: Section, i: number ) => {
            const p = ( section.mutliplierT * t ) % 1;
            const start = this.calculateStart( section.start, section.upperStart, ( t * section.multiplier ) % 1 );
            const height = section.height - ( start - section.start );

            section.useStart = this.overlfow( start + ( i / this.sections.length + p ) * this.size.height );
            section.useHeight = height;
        } );
    }

    draw( context: CanvasRenderingContext2D ) {
        context.beginPath();
        context.translate( this.position.x, this.position.y );

        this.sections.forEach( ( section: Section ) => {
            const maxHeight = this.size.height - section.useStart;

            context.rect( 0, section.useStart, this.size.width, Math.min( section.useHeight, maxHeight ) );

            if ( section.useStart + section.useHeight > this.size.height ) {
                context.rect( 0, 0, this.size.width, ( section.useStart + section.useHeight ) % this.size.height );
            }
        } );

        context.translate( - this.position.x, - this.position.y );

        context.fillStyle = "white";
        context.fill();
    }

    private overlfow( value: number ): number {
        return value % this.size.height;
    }

    private calculateStart( from: number, to: number, t: number ): number {
        const difference = to - from;

        if ( t < 0.5 ) {
            return from + difference * ease( t * 2 );
        } else {
            t = ( t - 0.5 ) * 2;
            return to - difference * ease( t );
        }
    }
}
