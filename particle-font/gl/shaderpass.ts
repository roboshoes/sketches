import {
    ClampToEdgeWrapping,
    DataTexture,
    FloatType,
    Mesh,
    NearestFilter,
    PerspectiveCamera,
    PlaneBufferGeometry,
    RGBAFormat,
    Scene,
    ShaderMaterial,
    Texture,
    WebGLRenderer,
    WebGLRenderTarget,
} from "three";

const vertexShader = `
    void main() {
        gl_Position = vec4( position, 1 );
    }
`;

const geometry = new PlaneBufferGeometry( 2, 2 );
const camera = new PerspectiveCamera( 90, 1, 1, 10000 );

camera.position.z = 2;

export function createTexture( width: number,
                               height: number,
                               defaultValue: number | number[] = 0 ): DataTexture {

    let array: Float32Array;
    let texture: DataTexture;

    if ( Array.isArray( defaultValue ) ) {

        array = Float32Array.from( defaultValue );

    } else {

        array = new Float32Array( width * height * 4 );
        array.fill( defaultValue );

    }

    texture = new DataTexture( array, width, height, RGBAFormat, FloatType );
    texture.needsUpdate = true;

    return texture;
}

export interface Uniforms {
    [ key: string ]: { value: any };
}

export interface ShaderPassOptions {
    name: string;
    shader: string;
    renderer: WebGLRenderer;
    side: number;
    uniforms: { [ key: string ]: any };
    startValue: number | number[];
}

export class ShaderPass {
    private renderTargets: WebGLRenderTarget[];
    private materials: ShaderMaterial[];
    private meshes: Mesh[];
    private name: string;
    private current: number;
    private latest: number;
    private renderer: WebGLRenderer;
    private size: number;
    private readonly scene = new Scene();

    constructor( options: ShaderPassOptions ) {
        this.current = 0;
        this.latest = 1;
        this.name = options.name;
        this.renderer = options.renderer;
        this.size = options.side;

        this.materials = [ 0, 1 ].map( () => {
            const size: string = this.size.toFixed( 1 );
            const uniforms: Uniforms = this.makeUniforms( options );

            const material = new ShaderMaterial( {
                uniforms,
                vertexShader,
                fragmentShader: options.shader,
            } );

            material.defines.resolution = "vec2(" + size + ", " + size + ")";
            material.defines.WIDTH = size;
            material.defines.HEIGHT = size;

            return material;
        } );

        this.renderTargets = [ 0, 1 ].map( () => new WebGLRenderTarget( this.size, this.size, {
            depthBuffer: false,
            stencilBuffer: false,
            wrapS: ClampToEdgeWrapping,
            wrapT: ClampToEdgeWrapping,
            type: FloatType,
            minFilter: NearestFilter,
            magFilter: NearestFilter
        } ) );

        var mesh;

        this.meshes = [ 0, 1 ].map( ( index: number ) => {
            mesh = new Mesh( geometry, this.materials[ index ] );
            mesh.layers.set( index + 1 );

            this.scene.add( mesh );

            return mesh;
        } );

        for ( var i = 0; i < 2; i++ ) {
            camera.layers.set( i + 1 );
            this.renderer.render( this.scene, camera, this.renderTargets[ i ] );
        }
    }

    setUniforms( uniforms: { [ key: string ]: any } ) {
        for ( var key in uniforms ) {
            ( this.meshes[ this.current ].material as ShaderMaterial ).uniforms[ key ].value =
                uniforms[ key ];
        }
    }

    setPermanentUniforms( uniforms: { [ key: string ]: any } ) {
        for ( var key in uniforms ) {
            ( this.meshes[ 0 ].material as ShaderMaterial ).uniforms[ key ].value = uniforms[ key ];
            ( this.meshes[ 1 ].material as ShaderMaterial ).uniforms[ key ].value = uniforms[ key ];
        }
    }

    compute( debug = false ) {
        const a: number = this.current;
        const b: number = ( this.current + 1 ) % 2;

        camera.layers.set( a + 1 );

        ( this.meshes[ a ].material as ShaderMaterial ).uniforms[ this.name ].value =
            this.renderTargets[ b ].texture;

        this.renderer.render( this.scene, camera, this.renderTargets[ a ] );

        if ( debug ) this.renderer.render( this.scene, camera );

        this.latest = this.current;
        this.current = ++this.current % 2;
    }

    getTexture(): Texture {
        return this.renderTargets[ this.latest ].texture;
    }

    private makeUniforms( options: ShaderPassOptions ): Uniforms {
        const uniforms: Uniforms = {};

        uniforms[ options.name ] = {
            value: createTexture( this.size, this.size, options.startValue )
        };

        for ( const key in options.uniforms ) {
            uniforms[ key ] = { value: options.uniforms[ key ] };
        }

        return uniforms;
    }
}