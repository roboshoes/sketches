uniform sampler2D velocityTexture;

const vec3 color = vec3( 1.0 );

varying float speed;

void main() {
    float percentToCenter = length( gl_PointCoord - vec2( 0.5 ) ) / 0.5;
    float alpha = 1.0 - smoothstep( 0.8, 1.0, percentToCenter );

    gl_FragColor = vec4( vec3( alpha - speed / 30.0 ), alpha );
}