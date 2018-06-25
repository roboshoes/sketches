uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;

uniform float seperationDistance;
uniform float alignmentDistance;
uniform float cohesionDistance;
uniform float delta;

const float PI = 3.141592653589793;
const float TAU = PI * 2.0;
#pragma glslify: curl = require(glsl-curl-noise)

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 velocity = texture2D( velocityTexture, uv ).xyz;
    vec3 position = texture2D( positionTexture, uv ).xyz;

    vec3 v = curl( position / vec3( 100 ) );

    gl_FragColor = vec4( v, 1 );
}
