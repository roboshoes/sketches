uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform vec2 mouse;

uniform float delta;

float lessThan( float a, float b ) {
    return ( 1.0 - step( a, b ) );
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    vec3 position = texture2D( positionTexture, uv ).xyz;
    vec3 velocity = texture2D( velocityTexture, uv ).xyz;
    vec3 p = position + velocity * delta * 15.0;

    float dist = distance( position.xy, mouse );

    p.x += lessThan( 10.0, dist ) * 30.0;

    gl_FragColor = vec4( p, 1.0 );
}
