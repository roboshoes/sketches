import { Color, DoubleSide, Mesh, PlaneBufferGeometry, ShaderLib, ShaderMaterial, UniformsUtils } from "three";

const projectVertex = `
    #include <common>
    #include <uv_pars_vertex>
    #include <uv2_pars_vertex>
    #include <envmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>

    const float radius = 10.0;
    const float innerRadius = 5.0;

    uniform vec3 uColor;

    void main() {
        vColor = uColor;

        vec4 transformed = vec4( position, 1.0 );
        vec4 screenPosition = projectionMatrix * modelViewMatrix * transformed;

        float toCenter = length( screenPosition.xy );

        transformed.z -= smoothstep( 0.0, radius, ( radius - clamp( toCenter, 0.0, radius ) ) ) * 7.0;

        gl_Position = projectionMatrix * modelViewMatrix * transformed;
    }
`;

const geometry = new PlaneBufferGeometry( 5, 1, 100, 50 );
const material = new ShaderMaterial( {
    uniforms: UniformsUtils.merge( [
        ShaderLib.basic.uniforms,
        {
            uColor: { value: new Color( 1, 0, 0 ) }
        }
    ] ),

    defines: {
        USE_COLOR: "1"
    },

    side: DoubleSide,

    vertexShader: projectVertex,
    fragmentShader: ShaderLib.basic.fragmentShader,
} );

export class Ribbon extends Mesh {
    private start: number ;
    private y: number;
    private z: number;

    constructor() {
        const m = material.clone();

        m.uniforms.uColor.value = new Color( Math.random() * 0.7 + 0.3, 0, 0 );

        super( geometry, m );

        this.start = Math.random();
        this.y = 7 - Math.random() * 14;
        this.z = Math.random() * 5;

        this.scale.set( Math.random() + 0.5, Math.random(), 1 );
    }

    update( t: number ) {
        const p = ( 1 - t + this.start ) % 1;
        const x = 15 + p * -30;

        this.position.set( x, this.y, this.z );
    }
}
