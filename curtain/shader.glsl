#define TAU 6.28318530718

#pragma glslify: snoise2 = require( glsl-noise/simplex/2d )
#pragma glslify: ease = require( glsl-easings/quadratic-in-out )

uniform float time;

// Map a number to values from 0 - 1. `value` should never be more than twice the edge.
float calculateT( float value, float edge ) {
    float aboveEdge = step( edge, value );
    float belowEdge = 1.0 - aboveEdge;

    return belowEdge * ease( value / edge ) +
           aboveEdge * ease( 1.0 - ( value - edge ) / edge );
}

// Get the pixel with a specific offset with subpixel aliasing.
vec4 getOffsetPixel( vec2 offset ) {
    vec2 floorXY = gl_FragCoord.xy + floor( offset );
    vec2 ceilXY = gl_FragCoord.xy + ceil( offset );

    vec4 imageBase = getPixelXY( floorXY );
    vec4 imageNext = getPixelXY( ceilXY );

    return mix( imageBase, imageNext, fract( offset.x ) );
}

float calculateTtime( float loop ) {
    float overflow = mod( time, loop );
    return calculateT( overflow, loop / 2.0 );
}

vec4 getDistortedPixel( float offset, float time ) {
    float percentY = calculateT( gl_FragCoord.y, resolution.x / 2.0 );
    float percentX = calculateT( gl_FragCoord.x, resolution.x / 2.0 );
    float bothWays = ( calculateTtime( time ) - 0.5 ) * 2.0;

    float yOffset =
        offset *
        snoise2( gl_FragCoord.xy / vec2( 200.0 ) ) *
        cos( TAU * percentY ) *
        bothWays *
        ease( percentY ) *
        ease( percentX );

    return getOffsetPixel( vec2( yOffset, 0.0 ) );
}

void main() {
    gl_FragColor = vec4(
        getDistortedPixel( 10.0, 4.0 ).r,
        getDistortedPixel( 14.0, 3.0 ).g,
        getDistortedPixel( 16.0, 2.0 ).b,
        1.0
    );
}