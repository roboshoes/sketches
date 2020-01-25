const vec2 center = vec2( 0.5 );

float easeInOut( float t ) {
    return mix(
        4.0 * t * t * t,
        0.5 * pow( 2.0 * t - 2.0, 3.0 ) + 1.0,
        step( 0.5, t )
    );
}

vec2 easeInOut( vec2 v ) {
    return vec2(
        easeInOut( v.x ),
        easeInOut( v.y )
    );
}


void main() {
    vec2 xy = gl_FragCoord.xy / vec2( 1024 );

    vec4 pixel = getPixel( easeInOut( xy ) );

    gl_FragColor = pixel;

    // vec4 invert = vec4( 1.0 - pixel.r, 1.0 -pixel.g, 1.0 -pixel.b, 1 );

    // float flip = step( 0.5, length( xy - center ) );

    // if ( xy.x > xy.y ) {
    //     flip = 1.0 - flip;
    // }

    // if ( 1.0 - xy.x > xy.y ) {
    //     flip = 1.0 - flip;
    // }

    // if ( step( 0.25, length( xy - center ) ) == 0.0 ) {
    //     flip = 1.0 - flip;
    // }

    // gl_FragColor = mix( pixel, invert, flip );
}
