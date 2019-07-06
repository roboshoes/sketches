#define PI 3.141592653589

uniform float t;

const vec2 center = vec2( 512 );
const vec4 backgroundColor = vec4( 1, 1, 1, 1 );
const vec4 circleColor = vec4( 1, 0, 0, 1 );
const float TAU = PI * 2.0;

vec4 colorAt( vec2 xy ) {
    float inCircle = step( distance( center, xy ), 200.0 );
    return mix( backgroundColor, circleColor, inCircle );
}

void main() {
    vec2 xy = gl_FragCoord.xy;

    xy.x += step( 0.5, fract( xy.y / 20.0 ) ) * sin( t * TAU ) * 20.0;

    vec4 pixel = colorAt( xy );

    gl_FragColor = pixel;
}