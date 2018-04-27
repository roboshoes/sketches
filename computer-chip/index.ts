import { random, times } from "lodash";

import { GrowLine, LineOrientation } from "./scripts/components/Line";
import { Point } from "./scripts/components/Point";
import { Rectangle } from "./scripts/components/Rectangle";

const canvas = document.getElementById( "canvas" ) as HTMLCanvasElement;
const context = canvas.getContext( "2d" );

const rectangles: Rectangle[] = [];
const lines: GrowLine[] = [];

function init() {
    clear();

    const a = new Point();
    const b = new Point( window.innerWidth, window.innerHeight );

    rectangles.push( new Rectangle( a, b ) );

    canvas.addEventListener( "mouseup", pulse );

    render();
}

function clear() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function render() {
    clear();

    for ( let i = 0; i < lines.length; i++ ) {
        const line = lines[ i ];

        for ( let j = 0; j < rectangles.length; j++ ) {
            const rectangle = rectangles[ j ];

            if ( rectangle.isIntersecting( line ) ) {
                rectangles.splice( j, 0, rectangle.split( line ) );
                j++;
            }
        }

        if ( line.dead ) {
            lines.splice( i, 1 );
            i--;
        }
    }

    rectangles.forEach( rectangle => rectangle.draw( context ) );
    lines.forEach( line => line.update() );

    requestAnimationFrame( render );
}

function pulse() {
    lines.push( ...times<GrowLine>( 10, () => {
        const point = new Point();

        const orientation = Math.random() > 0.5 ?
            LineOrientation.HORIZONTAL :
            LineOrientation.VERTICAL;

        const sign = Math.random() > 0.5 ? -1 : 1;

        if ( orientation === LineOrientation.VERTICAL ) {
            point.x = Math.random() * window.innerWidth;
            point.y = sign > 0 ? 0 : window.innerHeight;
        } else {
            point.x = sign > 0 ? 0 : window.innerWidth;
            point.y = Math.random() * window.innerHeight;
        }

        const speed = random( 5, 10 );

        point.round();

        return new GrowLine( point, orientation, speed * sign );
    } ) );
}

init();
