import take from "mout/array/take";
import { Vector2 } from "three";

import { ANCHORS, stage, startTime } from "./config";
import { loopNoise2d } from "./noise";
import { bezier } from "./render";

class Anchor extends Vector2 {
    constructor( horizontal, vertical ) {
        super( stage.width * horizontal, stage.height * vertical );

        this.origin = new Vector2( this.x, this.y );
        this.distanceFromCenter = stage.center.distanceTo( this );
    }

    update( multiplyer ) {
        const percent = ( ( Date.now() - startTime ) % 6000 ) / 6000;
        const radius = 600;
        const factor = loopNoise2d( percent, this.origin ) *
                       60 *
                       multiplyer *
                       ( this.distanceFromCenter > radius ? 0 : 1 ) *
                       ( Math.pow( ( 1 - this.distanceFromCenter / radius ) , 2 ) );

        this.y = this.origin.y + factor;
    }
}

export class Line {
    constructor( verticalPercent ) {
        this.anchors = take( ANCHORS, i => new Anchor( i / ( ANCHORS - 1 ), verticalPercent ) );
    }

    render( context ) {
        this.renderWithSettings( context, "magenta", 2.5, 1.2 );
        this.renderWithSettings( context, "cyan", 2.5, 0.9 );
        this.renderWithSettings( context, "black", 4, 1 );
    }

    renderWithSettings( context, color, girth, factor ) {
        context.beginPath();

        context.moveTo( this.anchors[ 0 ].x, this.anchors[ 0 ].y );

        for ( let i = 1; i < this.anchors.length; i++ ) {
            let anchor = this.anchors[ i ];
            anchor.update( factor );
        }

        bezier( context, this.anchors );

        context.strokeStyle = color;
        context.lineWidth = girth;
        context.stroke();
    }
}