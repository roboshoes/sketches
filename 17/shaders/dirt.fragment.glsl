const vec3 color = vec3( 1.0 );

varying float dist;

void main() {

    float percentToCenter = distance( gl_PointCoord, vec2( 0.5 ) ) / 0.5;
    float alpha = 1.0 - smoothstep( 0.0, 1.0, percentToCenter );

    alpha *= 1.0 / max( 1.0, dist / 100.0 );

    gl_FragColor = vec4( color, alpha );
}