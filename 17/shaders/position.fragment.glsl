uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;

uniform float delta;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    vec3 position = texture2D( positionTexture, uv ).xyz;
    vec3 velocity = texture2D( velocityTexture, uv ).xyz;

    vec3 newPosition = position + velocity * delta * 15.0;

    newPosition.y = max( newPosition.y, -100.0 );

    gl_FragColor = vec4( newPosition, 1.0 );
}
