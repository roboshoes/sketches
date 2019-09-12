import { DoubleSide, Mesh, PlaneBufferGeometry, ShaderLib, ShaderMaterial, UniformsLib, UniformsUtils } from "three";

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

    uniform float time;

    const float radius = 5.0;

    void main() {
        vColor = color;

        vec4 transformed = vec4( position, 1.0 );
        vec4 screenPosition = projectionMatrix * modelViewMatrix * transformed;

        float toCenter = length( screenPosition.xy );

        transformed.z += smoothstep( 0.0, radius, ( radius - clamp( toCenter, 0.0, radius ) ) ) * 5.0;

        gl_Position = projectionMatrix * modelViewMatrix * transformed;
    }
`;

const start = Date.now();

export class Ribbon extends Mesh {
    constructor() {
        const geometry = new PlaneBufferGeometry( 10, 5, 100, 50 );
        const material = new ShaderMaterial( {
            uniforms: UniformsUtils.merge( [
                UniformsLib.common,
                UniformsLib.specularmap,
                UniformsLib.envmap,
                UniformsLib.aomap,
                UniformsLib.lightmap,
                UniformsLib.fog,
                {
                    time: { value: ( Date.now() - start ) / 1000 },
                }
            ] ),

            defines: {
                USE_COLOR: "1"
            },

            side: DoubleSide,

            vertexShader: ShaderLib.basic.vertexShader,
            fragmentShader: ShaderLib.basic.fragmentShader,
        } );

        material.defaultAttributeValues = {
            color: [ 1, 0, 0 ],
        }

        material.onBeforeCompile = ( shader ) => {
            shader.vertexShader = projectVertex;
        };

        super( geometry, material );
    }

    update() {
        const delta: number = ( ( Date.now() - start ) / 1000 ) % 6;

        this.position.set( Math.sin( delta / 10.0 * Math.PI * 2 - Math.PI ) * 10, 0, 0 );

        ( this.material as ShaderMaterial ).uniforms.time.value = delta;
    }
}