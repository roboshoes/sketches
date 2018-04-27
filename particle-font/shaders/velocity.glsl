uniform sampler2D velocityTexture;
uniform sampler2D positionTexture;

uniform float seperationDistance;
uniform float alignmentDistance;
uniform float cohesionDistance;
uniform float delta;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;
const float SPEED_LIMIT = 9.0;
const vec3 CENTER = vec3( 0, -200, 0 );

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 velocity = texture2D( velocityTexture, uv ).xyz;
    vec3 position = texture2D( positionTexture, uv ).xyz;

    float zoneRadius = seperationDistance + alignmentDistance + cohesionDistance;
    float seperationThreshold = seperationDistance / zoneRadius;
    float alignmentThreshold = ( seperationDistance + alignmentDistance ) / zoneRadius;
    float zoneRadiusSquared = zoneRadius * zoneRadius;

    // variables used in loop for every particle
    float dist;
    float distSquared;
    float percent;
    float force;
    vec3 direction;
    vec3 otherPosition;
    vec3 otherVelocity;
    vec2 otherUV;

    direction = position - vec3( position.x, -200, position.z );
    velocity -= normalize( direction ) * delta * 5.0;

    for ( float y = 0.0; y < HEIGHT; y++ ) {
        for ( float x = 0.0; x < WIDTH; x++ ) {

            otherUV = vec2( x + 0.5, y + 0.5 ) / resolution;
            otherPosition = texture2D( positionTexture, otherUV ).xyz;

            direction = otherPosition - position;
            dist = length( direction );
            distSquared = dist * dist;

            if ( dist < 0.0001 ) continue;

            if ( distSquared > zoneRadiusSquared ) continue;

            percent = distSquared / zoneRadiusSquared;

            if ( percent < seperationThreshold ) {

                // a little too close for comfort

                force = ( seperationThreshold / percent - 1.0 ) * delta;
                velocity -= normalize( direction ) * force;

            } else if ( percent < alignmentThreshold ) {

                // fly the same direction a little bit

                float thresholdDelta = alignmentThreshold - seperationThreshold;
                float thresholdPercent = ( percent - seperationThreshold ) / thresholdDelta;

                otherVelocity = texture2D( velocityTexture, otherUV ).xyz;

                force = ( 0.5 - cos( thresholdPercent * PI_2 ) * 0.5 + 0.5 ) * delta;
                velocity += normalize( otherVelocity ) * force;

            } else {

                // so far away - come closer

                float thresholdDelta = 1.0 - alignmentThreshold;
                float thresholdPercent = ( percent - alignmentThreshold ) / thresholdDelta;

                force = ( 0.5 - ( cos( thresholdPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;

                velocity += normalize( direction ) * force;
            }
        }
    }

    if ( length( velocity ) > SPEED_LIMIT ) {
        velocity = normalize( velocity ) * SPEED_LIMIT;
    }

    gl_FragColor = vec4( velocity, 1.0 );
}