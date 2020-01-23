import { Vector2 } from "three";

import { Anchor } from "./anchor";

export class Line {
    closed = false;

    constructor( private anchors: Anchor[] = [] ) {}

    draw( context: CanvasRenderingContext2D ) {
        context.beginPath();

        for ( let i = 0; i < this.anchors.length - 1; i++ ) {
            if ( i === 0 ) {
                const from: Vector2 = this.anchors[ i ].center;
                context.moveTo( from.x, from.y );
            }

            const ii: number = ( i + 1 ) % this.anchors.length;
            const to: Vector2 = this.anchors[ ii ].center;

            const anchorFrom: Vector2 = this.anchors[ i ].b;
            const anchorTo: Vector2 = this.anchors[ ii ].a;

            context.bezierCurveTo( anchorFrom.x, anchorFrom.y, anchorTo.x, anchorTo.y, to.x, to.y );
        }

        if ( this.closed ) {
            const last = this.anchors[ this.anchors.length - 1 ];
            const first = this.anchors[ 0 ];

            context.bezierCurveTo( last.b.x, last.b.y, first.a.x, first.a.y, first.center.x, first.center.y );
        }

        context.stroke();
        context.beginPath();
    }
}