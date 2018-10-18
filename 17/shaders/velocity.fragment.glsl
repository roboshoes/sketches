uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform vec2 mouse;

const float PI = 3.141592653589793;
const float TAU = PI * 2.0;

const vec3 zero = vec3( 0 );
const vec3 gravity = vec3( 0, -0.9, 0 );

float not( float value ) {
    return 1.0 - value;
}

float or( float a, float b ) {
    return min( 1.0, a + b );
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 velocity = texture2D( velocityTexture, uv ).xyz;
    vec3 position = texture2D( positionTexture, uv ).xyz;

    float isUntouched = float( distance( zero, velocity ) == 0.0 );
    float isWithinMouse = float( distance( position.xy, mouse ) < 20.0 );

    float drop = or( not( isUntouched ), isWithinMouse );

    gl_FragColor = mix( vec4( 0 ), vec4( velocity + gravity, 0 ), drop );
}
