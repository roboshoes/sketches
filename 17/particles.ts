import { random } from "lodash";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, WebGLRenderer } from "three";

import { createTexture, ShaderPass } from "./shader-pass";
// @ts-ignore
import fragmentShader from "./shaders/dirt.fragment.glsl";
// @ts-ignore
import vertexShader from "./shaders/dirt.vertex.glsl";


export interface ParticlesOptions {
    positionShader: string;
    positionUniforms: { [ key: string ]: any};

    velocityShader: string;
    velocityUniforms: { [ key: string ]: any};

    renderer: WebGLRenderer;
}

export class Particles extends Points {

    private positionPass: ShaderPass;
    private velocityPass: ShaderPass;
    private count: number;
    private latest: number;

    constructor( size: number, options: ParticlesOptions ) {
        const references = new Float32Array( size * size * 2 );

        let i = 0;

        for ( let y = 0; y < size; y++ ) {
            for ( let x = 0; x < size; x++ ) {
                references[ i ] = x / size;
                references[ i + 1 ] = y / size;
                i += 2;
            }
        }

        const positionPass = new ShaderPass( {
            renderer: options.renderer,
            shader: options.positionShader,
            name: "positionTexture",
            size,
            startValue: ( () => {
                const array: number[] = [];

                for ( let j = 0, length = size * size; j < length; j++ ) {
                    array.push(
                        random( -100, 100 ),
                        random( -100, 100 ),
                        random( -100, 100 ),
                        0,
                    );
                }

                return array;
            } )(),
            uniforms: {
                ...options.positionUniforms,
                delta: 0.016,
                velocityTexture: createTexture( size, size, 0 ),
            },
        } );

        const velocityPass = new ShaderPass( {
            renderer: options.renderer,
            shader: options.velocityShader,
            name: "velocityTexture",
            size,
            startValue: 0,
            uniforms:  {
                ...options.velocityUniforms,
                positionTexture: positionPass.getTexture(),
                delta: 0.016,
            },
        } );

        const material = new ShaderMaterial( {
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,

            vertexShader,
            fragmentShader,

            uniforms: {
                positionTexture: { value: positionPass.getTexture() },
            },
        } );

        const geometry = new BufferGeometry();

        geometry.addAttribute( "position", new BufferAttribute( new Float32Array( size * size * 3 ), 3 ) );
        geometry.addAttribute( "reference", new BufferAttribute( references, 2 ) );

        super( geometry, material );

        this.frustumCulled = false;
        this.count = size * size;
        this.latest = 0;

        this.positionPass = positionPass;
        this.velocityPass = velocityPass;
    }

    update( now: number ): void {
        const delta: number = ( now - this.latest ) / 1000;

        this.velocityPass.setUniforms( {
            positionTexture: this.positionPass.getTexture(),
            delta,
        } );

        this.positionPass.setUniforms( {
            velocityTexture: this.velocityPass.getTexture(),
            delta,
        } );

        this.velocityPass.compute();
        this.positionPass.compute();

        ( this.material as ShaderMaterial ).uniforms.positionTexture.value =
            this.positionPass.getTexture();

        this.latest = now;
    }
}
