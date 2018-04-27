// some stuff we are gonna need

const TAU = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;

const settings = {
    "slices": 32,
    "radius": 1024 / 2,
    "seperation": 515
};

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( 1024, 1024 );
const camera = new THREE.PerspectiveCamera( 90, 1, 1, 10000 );
camera.aspect = 1;
camera.updateProjectionMatrix();

var raf;

// The plane that the shader draws on

function getTriangleSide() {
    const angle = PI_HALF - ( ( TAU / settings.slices ) / 2 );
    const side = 2 * settings.radius * Math.cos( angle );

    return side;
}

class KaleidoPlane extends THREE.Mesh {
    constructor( canvas, renderer ) {
        const texture = new THREE.Texture( canvas );

        texture.anistropy = renderer.getMaxAnisotropy();
        texture.needsUpdate = true;

        const geometry = new THREE.PlaneBufferGeometry( 2, 2, 1, 1 );
        const material = new THREE.ShaderMaterial( {
            uniforms: {
                image: { value: texture },
                imageSize: { value: new THREE.Vector2( canvas.width, canvas.height ) },
                resolution: { value: new THREE.Vector2( 1024, 1024 ) },
                radius: { value: settings.radius },
                slices: { value: settings.slices },
                maxSize: { value: getTriangleSide() },
                seperation: { value: settings.seperation }
            },

            fragmentShader: document.getElementById( "fragment" ).innerText,
            vertexShader: document.getElementById( "vertex" ).innerText
        } );

        super( geometry, material );

        this.texture = texture;

        window.addEventListener( "resize", function() {
            material.uniforms.resolution.value.set(
                window.innerWidth,
                window.innerHeight
            );
            material.needsUpdate = true;
        } );
    }

    update() {
        this.texture.needsUpdate = true;
    }
}

// Texture shenanigans

class Shape {
    constructor() {
        this.x = Math.random() * 1024;
        this.y = Math.random() * 512;
        this.width = 10 + Math.random() * 40;
        this.height = 10 + Math.random() * 40;
        this.rotation = Math.random() * TAU;
        this.color = "#" +
            Math.round( Math.random() * 15 ).toString( 16 ) +
            Math.round( Math.random() * 15 ).toString( 16 ) +
            "0000";

        this.rotate = ( - Math.PI + TAU * Math.random() ) / TAU / 10;
    }

    update() {
        this.rotation += this.rotate;
    }
}

class Pattern {

    constructor() {
        this.canvas = document.createElement( "canvas" );
        this.context = this.canvas.getContext( "2d" );

        this.canvas.width = 1024;
        this.canvas.height = 512;

        this.shapes = [];

        this.randomCanvas();
    }

    getCanvas() {
        return this.canvas;
    }

    update() {
        this.context.fillStyle = "white";
        this.context.fillRect( 0, 0, 1024, 512 );

        var shape;

        for ( var i = 0; i < this.shapes.length; i++ ) {
            shape = this.shapes[ i ];
            shape.update();

            this.context.save();
            this.context.translate( shape.x, shape.y );
            this.context.rotate( shape.rotation );
            this.context.strokeStyle = shape.color;
            this.context.strokeRect( 0, 0, shape.width, shape.height );
            this.context.restore();
        }
    }

    randomCanvas() {
        for ( var i = 0; i < 150; i++ ) {
            this.shapes.push( new Shape() );
        }

        this.update();
    }
}

// let's get this jazz setup

onResize();

document.body.appendChild( renderer.domElement );

window.addEventListener( "resize", onResize );

const pattern = new Pattern();
const plane = new KaleidoPlane( pattern.getCanvas(), renderer );

scene.add( plane );

raf = requestAnimationFrame( render );

// callbacks

function onResize() {
    renderer.setSize( 1024, 1024 );

    camera.aspect = 1;
    camera.updateProjectionMatrix();
}

function render() {
    pattern.update();
    plane.update();

    renderer.render( scene, camera );

    raf = requestAnimationFrame( render );
}