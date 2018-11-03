const vec3 color = vec3( 1.0 );

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    float percentToCenter = length( gl_PointCoord - vec2( 0.5 ) ) / 0.5;
    float alpha = 1.0 - smoothstep( 0.8, 1.0, percentToCenter );

    gl_FragColor = vec4( color, alpha );
}