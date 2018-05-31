import { random, times } from "lodash";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, WebGLRenderer } from "three";
import { createTexture, ShaderPass, Uniforms } from "./shaderpass";

// @ts-ignore
import fragmentShader from "../shaders/fragment.glsl";
// @ts-ignore
import vertexShader from "../shaders/vertex.glsl";



export interface ParticlesOptions {
    positionShader: string,
    positionUniforms: { [ key: string ]: any},

    velocityShader: string,
    velocityUniforms: { [ key: string ]: any},

    renderer: WebGLRenderer,
}

export class Particles extends Points {

    private size: number;
    private positionPass: ShaderPass;
    private velocityPass: ShaderPass;
    private count: number;
    private latest: number;

    constructor( size: number, options: ParticlesOptions ) {
        const references = new Float32Array( size * size * 2 );

        var i = 0;

        for ( var y = 0; y < size; y++ ) {
            for ( var x = 0; x < size; x++ ) {
                references[ i ] = x / size;
                references[ i + 1 ] = y / size;
                i += 2;
            }
        }

        const positionPass = new ShaderPass( {
            renderer: options.renderer,
            shader: options.positionShader,
            name: "positionTexture",
            side: size,
            startValue: ( function() {
                let array: number[] = [];

                for ( let i = 0, length = size * size; i < length; i++ ) {
                    array.push(
                        random( -100, 100 ),
                        random( -100, 400 ),
                        random( -100, 100 ),
                        0
                    );
                }

                return array;
            } )(),
            uniforms: {
                ...options.positionUniforms,
                delta: 0.016,
                velocityTexture: createTexture( size, size, 5 ),
            }
        } );

        const velocityPass = new ShaderPass( {
            renderer: options.renderer,
            shader: options.velocityShader,
            name: "velocityTexture",
            side: size,
            startValue: times( size * size * 4, () => random( -5, 5 ) ),
            uniforms:  {
                ...options.velocityUniforms,
                positionTexture: positionPass.getTexture(),
                delta: 0.016
            }
        } );

        const material = new ShaderMaterial( {
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,

            vertexShader,
            fragmentShader,

            uniforms: {
                positionTexture: { value: positionPass.getTexture() }
            }
        } );

        const geometry = new BufferGeometry();

        geometry.addAttribute( "position", new BufferAttribute( new Float32Array( size * size * 3 ), 3 ) );
        geometry.addAttribute( "reference", new BufferAttribute( references, 2 ) );

        super( geometry, material );

        this.frustumCulled = false;
        this.count = size * size;
        this.size = size;
        this.latest = 0;

        this.positionPass = positionPass;
        this.velocityPass = velocityPass;
    }

    update( now: number ) {
        const delta: number = ( now - this.latest ) / 1000;

        this.velocityPass.setUniforms( {
            positionTexture: this.positionPass.getTexture(),
            delta,
        } );

        this.positionPass.setUniforms( {
            velocityTexture: this.velocityPass.getTexture(),
            delta,
        } );

        this.velocityPass.compute( false );
        this.positionPass.compute( false );

        ( this.material as ShaderMaterial ).uniforms.positionTexture.value =
            this.positionPass.getTexture();
    }
}