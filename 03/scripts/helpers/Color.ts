import { pad } from "lodash";

export class Color {

    private r: number;
    private g: number;
    private b: number;

    constructor( value: number ) {
        this.r = value >> 16;
        this.g = value >> 8 & 0x00FF;
        this.b = value & 0x0000FF;
    }

    static random(): Color {
        const MAX_VALUE = 0xFFFFFF;
        const color = Math.floor( Math.random() * MAX_VALUE );

        return new Color( color );
    }

    shade( percent: number ): this {
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;

        this.r = Math.round( ( t - this.r ) * p ) + this.r;
        this.g = Math.round( ( t - this.g ) * p ) + this.g;
        this.b = Math.round( ( t - this.b ) * p ) + this.b;

        return this;
    }

    clone(): Color {
        return new Color( ( this.r << 16 ) + ( this.g << 8 ) + ( this.b ) );
    }

    toString(): string {
        return `#${ [ this.r, this.g, this.b ].map( c => pad( c.toString( 16 ) ) ).join("") }`;
    }
}
