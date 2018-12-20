import { random } from "lodash";

export interface IMotion {
    update( t: number ): void;
    value: number;
}

export class Motion implements IMotion {

    protected current: number;
    protected difference: number;

    get value() { return this.current; }

    constructor( protected from: number, protected to: number ) {
        this.current = from;
        this.difference = to - from;
    }

    update( t: number ): void {
        const p = ( Math.cos( - Math.PI + Math.PI * 2 * t ) + 1 ) / 2;
        this.current = this.from + p * this.difference;
    }
}

export class HalfMotion extends Motion {
    update( t: number ): void {
        const p = ( Math.cos( - Math.PI + Math.PI * t ) + 1 ) / 2;
        this.current = this.from + p * this.difference;
    }
}

export class MotionSequence implements IMotion {
    private motions: IMotion[] = [];
    private current: number;

    get value() { return this.current; }

    constructor( private amount: number, from: number, to: number  ) {
        if ( amount === 1 ) {

            this.motions.push( new Motion( from, to ) );

        } else {

            let current = random( from, to );
            const first = current;

            for ( let i = 0; i < amount; i++ ) {
                if ( i === amount - 1 ) {
                    this.motions.push( new HalfMotion( current, first ) );
                } else {
                    const next = random( from, to );
                    this.motions.push( new HalfMotion( current, next ) );
                    current = next;
                }
            }
        }

        this.update( 0 );
    }

    update( t: number ) {

        if ( this.motions.length === 1 ) {
            this.motions[ 0 ].update( t );
            this.current = this.motions[ 0 ].value;
        }
        const slice = 1 / this.amount;
        const index = Math.floor( t / slice );
        const tt = ( t / slice - Math.floor( t / slice ) );

        this.motions[ index ].update( tt );
        this.current = this.motions[ index ].value;
    }
}