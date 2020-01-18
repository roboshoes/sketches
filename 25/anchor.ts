import { Vector2 } from "three";

const ZERO = new Vector2();
const vector = new Vector2();

export class Anchor {
    private length: number;

    private _center = new Vector2();
    get center(): Vector2 {
        return this._center.lerpVectors( this.a, this.b, 0.5 );
    }

    get rotation(): number {
        vector.subVectors( this.a, this.center );
        return Math.atan2( vector.y, vector.x );
    }

    set rotation( value: number ) {
        const center = this.center.clone();
        const [ upperLeg, lowerLeg ] = Anchor.calculateLegs( value, this.length );

        this.a.copy( center.clone().add( upperLeg ) );
        this.b.copy( center.clone().add( lowerLeg ) );
    }

    constructor( public a: Vector2, public b: Vector2 ) {
        this.length = vector.copy( a ).distanceTo( b ) / 2;
    }

    static fromOrientation( point: Vector2, angle: number, length = 100 ): Anchor {
        const [ upperLeg, lowerLeg ] = Anchor.calculateLegs( angle, length );

        return new Anchor(
            point.clone().add( upperLeg ),
            point.clone().add( lowerLeg ),
        );
    }

    private static calculateLegs( angle: number, length = 100 ): [ Vector2, Vector2 ] {
        const upperLeg = new Vector2( length, 0 ).rotateAround( ZERO, angle );
        const lowerLeg = upperLeg.clone().rotateAround( ZERO, Math.PI );

        return [ upperLeg, lowerLeg ];
    }
}
