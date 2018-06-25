import { padStart, repeat } from "lodash";

export function getGray( percent: number ): string {
    const fraction = Math.trunc( 0xff * percent);
    const base = padStart( fraction.toString( 16 ), 2, "0" );

    return `#${ repeat( base, 3 ) }`;
}