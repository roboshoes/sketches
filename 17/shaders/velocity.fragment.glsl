uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;
uniform sampler2D fontTexture;
uniform vec2 mouse;

const vec3 gravity = vec3( 0, -9.0, 0 );
const vec4 noChange = vec4( vec3( 0 ), 1 );

float not( float value ) {
    return 1.0 - value;
}

float or( float a, float b ) {
    return min( 1.0, a + b );
}

float and( float a, float b ) {
    return step( 1.5, a + b );
}

vec2 calcRelativePoisition( vec2 position ) {
    vec2 xy = ( position.xy + vec2( 100 ) ) / vec2( 200 );
    return vec2( 1, 0 ) + vec2( -1, 1 ) * xy ;
}

vec4 ifElse( float edge, vec4 ifValue, vec4 elseValue ) {
    return mix( ifValue, elseValue, not( edge ) );
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 velocity = texture2D( velocityTexture, uv ).xyz;
    vec3 position = texture2D( positionTexture, uv ).xyz;
    vec2 xy = calcRelativePoisition( position.xy );
    vec3 font = texture2D( fontTexture, xy ).rgb;

    float isOnText = float( length( font ) > 0.0 );
    float isUntouched = float( length( velocity ) == 0.0 );
    float isWithinMouse = float( distance( position.xy, mouse ) < 20.0 );

    float isFrozen = and( isUntouched, isOnText );
    float shouldDrop = or( not( isUntouched ), isWithinMouse );
    vec4 dropping = vec4( velocity + gravity, 1 );

    gl_FragColor = ifElse(
        isOnText,
        noChange,
        ifElse(
            shouldDrop,
            dropping,
            noChange
        )
    );
}
