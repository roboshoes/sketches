import { Noise } from "noisejs";
import { Vector2 } from "three";

const noise = new Noise( Math.random() );
const tau = Math.PI * 2;
const vector = new Vector2();

export function loopNoise2d( percent, coordinates ) {
    const point = coordinates.clone().divideScalar( 100 );
    const angle = percent * tau;

    point.add( vector.set( Math.cos( angle ) * 0.3, Math.sin( angle ) * 0.3 ) );
    return noise.simplex2( point.x, point.y );
}

