import rand from "mout/random/rand";
import take from "mout/array/take";
import { Vector2 } from "three";
import { Noise } from "noisejs";
import { quadInOut } from "eases";
import { scaleDPI } from "./stage";
import { bezier } from "./math/bezier";

const ANCHORS = 20;
const noise = new Noise( Math.random() );

class Line {
    render( context ) {
        context.beginPath();
        bezier( context, this.anchors );
    }
}

export class StraightLine extends Line {
    constructor( area, x ) {
        super();

        this.anchors = take( ANCHORS, i => {
            return new Vector2( x, ( i / ( ANCHORS - 1 ) ) * area.height );
        } );
    }
}

export class GuideLine extends Line {

    constructor( height, x ) {
        super();

        this.x = x;
        this.height = height;
        this.duration = rand( 5000, 10000 );
        this.anchorSet = this.generateAnchorSet();
    }

    generateAnchors( offset ) {
        return take( ANCHORS, ( index ) => {
            let percent = index / ( ANCHORS - 1 );

            return new Vector2(
                this.x + noise.simplex2( percent * 4 + offset, 0 ) * 50,
                percent * this.height
            );
        } );
    }

    generateAnchorSet() {
        var array = [];

        for ( let i = 0; i < 4; i++ ) {
            array.push( this.generateAnchors( rand( 10, 100 ) ) );
        }

        return array;
    }

    calculateAnchors() {
        const length = this.anchorSet.length;
        const timePercent = ( Date.now() % this.duration ) / this.duration;
        const floatIndex = length * timePercent;
        const lerpPercent = quadInOut( floatIndex % 1 );
        const setFrom = this.anchorSet[ Math.floor( floatIndex ) % length ];
        const setTo = this.anchorSet[ Math.ceil( floatIndex ) % length ];

        this.anchors = take( ANCHORS, i => {
            return new Vector2().copy( setFrom[ i ] ).lerp( setTo[ i ], lerpPercent );
        } );
    }

    render( context ) {
        super.render( context );

        context.strokeStyle = "red";
        context.lineWidth = scaleDPI( 4 );
        context.stroke();
    }
}

export class TweenLine extends Line {
    constructor( guideFrom, guideTo, percent ) {
        super();

        this.percent = percent;
        this.guideFrom = guideFrom;
        this.guideTo = guideTo;
    }

    render( context ) {
        this.anchors = take( ANCHORS, i => {
            return new Vector2().copy( this.guideFrom.anchors[ i ] ).lerp( this.guideTo.anchors[ i ], this.percent );
        } );

        super.render( context );

        context.strokeStyle = "black";
        context.lineWidth = scaleDPI( 1 + this.easeToDistance( this.percent ) * 3 );
        context.stroke();
    }

    easeToDistance( t ) {
        return Math.pow( 2 * t - 1 , 2 );
    }
}
