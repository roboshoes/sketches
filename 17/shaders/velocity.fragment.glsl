uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform vec2 mouse;

const float PI = 3.141592653589793;
const float TAU = PI * 2.0;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 velocity = texture2D( velocityTexture, uv ).xyz;

    float dist = distance( uv, mouse );

    gl_FragColor = vec4(
        velocity + vec3( 0, 0, 0 ),
        1
    );
}
