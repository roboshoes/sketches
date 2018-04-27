import { CubeGeometry, Mesh, MeshBasicMaterial } from "three";

const TAU = Math.PI * 2;
const ANGLE_RANGE = 0.15;

function random( min: number, max: number): number {
    return min + Math.random() * ( max - min );
}

export class Block extends Mesh {
    private distanceToCenter: number;
    private timeOnPlane: number;
    private extraction: number;

    constructor() {
        const geometry = new CubeGeometry( 1, 4, 1 );
        const material = new MeshBasicMaterial( { color: 0xFFFFFF } );

        super( geometry, material );

        this.extraction = random( 1, 5 );
    }

    update() {
        this.distanceToCenter = this.position.length() / ( Math.sqrt( 2 ) * 50 );
        this.timeOnPlane = Math.atan2( this.position.z, this.position.x ) / TAU + 0.5;
    }

    extrude( angle: number ) {
        const t = this.withinAngle( angle );
        const scale = this.distanceToCenter * this.extraction * t;

        this.scale.y = 1 + scale;
        this.position.y = scale * 5;
    }

    private withinAngle( angle: number ): number {
        const distance = Math.min(
            this.difference( this.timeOnPlane, angle ),
            this.difference( this.timeOnPlane - 1, angle ),
            this.difference( this.timeOnPlane + 1, angle ),
        )

        if ( distance <= ANGLE_RANGE ) {
            return 1 - ( distance / ANGLE_RANGE );
        }

        return 0;
    }

    private difference( a: number, b: number ) {
        const max = Math.max( a, b );
        const min = Math.min( a, b );

        return Math.abs( max - min );
    }
}
