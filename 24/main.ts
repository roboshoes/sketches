import { bootstrap, draw, getCanvas, options } from "canvas-recorder/gl";
import { PerspectiveCamera, Scene, WebGLRenderer, Vector2, Vector3, AmbientLight } from "three";
import { Ribbon } from "./ribbon";

options( {
    size: [ 1024, 1024 ],
    frames: 60 * 60,
    record: false,
} )

const renderer = new WebGLRenderer( { canvas: getCanvas() } );
const camera = new PerspectiveCamera( 75, 1, 1, 10000 );
const scene = new Scene();
const ribbon = new Ribbon();

renderer.setSize( 1024, 1024 );

camera.aspect = 1;
camera.updateProjectionMatrix();
camera.position.set( 0, 0, -10 );
camera.lookAt( 0, 0, 0 );

scene.add( ribbon );

draw( () => {
    ribbon.update();

    renderer.render( scene, camera );
} );

bootstrap();