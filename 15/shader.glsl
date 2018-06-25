#define TAU 6.283185306

uniform float time;

const vec3 color1 = vec3( 95, 44, 130 ) / 255.0;
const vec3 color2 = vec3( 73, 160, 157 ) / 255.0;
const vec3 color3 = vec3( 17, 153, 142 ) / 255.0;
const vec3 color4 = vec3( 56, 239, 125 ) / 255.0;

void main() {
    vec2 position = gl_FragCoord.xy / resolution;
    vec4 data = getPixel();
    vec2 center = data.xy;
    float radius = data.z;

    float currentRadius = distance( center, position ) / radius;
    float edge = ( cos( currentRadius * TAU ) + 1.0 ) / 2.0;

    float offsetRadius = mod( ( currentRadius + time ), 1.0 );
    float lineT = mod( offsetRadius, 0.1 ) / 0.1;
    float on = smoothstep( edge - 0.1, edge,  lineT );

    vec3 gradientOne = mix( color1, color2, position.y );
    vec3 gradientTwo = mix( color3, color4, position.x );

    gl_FragColor = vec4( mix( gradientOne, gradientTwo, on ), 1 );
}