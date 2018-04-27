precision mediump float;

#define PI 3.14159265359
#define TAU 6.28318530718

uniform float time;
uniform vec2 resolution;

#pragma glslify: cnoise2 = require(glsl-noise/simplex/2d)

void rotate( inout vec2 vector, float a ) {
	float s = sin( a );
	float c = cos( a );

	mat2 m = mat2( c, -s, s, c );

	vector = m * vector;
}

void translate( inout vec2 vector, vec2 t ) {
    vector = vector + t;
}

float mapWave( float x ) {
    return ( x + 1.0 ) / 2.0;
}

float noiseMap( float granularity ) {
    vec2 xy = gl_FragCoord.xy;

    float offsetNoise = cnoise2( xy / granularity );

    float factor = mapWave( sin( time / 9000.0 ) );
    float factorOffset = mapWave(
        cos(
            xy.y / ( 13.37 * offsetNoise ) +
            time / 300.0 +
            xy.x / ( 24.87 * offsetNoise )
        )
    );

    float noise = cnoise2( xy / granularity );
    float fraction = fract( noise * 10.0 ) * 10.0;
    float edge = 1.5 * factor + factorOffset * 1.5;

    float on = step( edge, fraction );
    float off = 1.0 - step( 10.0 - edge, fraction );

    return min( on, off );
}

void main() {

    float map1 = noiseMap( 300.0 );
    float map2 = noiseMap( 500.0 );

    gl_FragColor = vec4( vec3( map2 ), 1.0 );
}