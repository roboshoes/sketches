uniform sampler2D positionTexture;

attribute vec2 reference;

varying float dist;

void main() {

    vec3 particlePosition = texture2D( positionTexture, reference ).xyz;

    dist = length( particlePosition );

    float multiplier = 1.0 - min( max( dist / 100.0, 0.0 ),  1.0 );

    gl_Position = projectionMatrix * modelViewMatrix * vec4( particlePosition.xyz, 1.0 );
    gl_PointSize = 4.0;
}