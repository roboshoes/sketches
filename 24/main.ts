import { bootstrap, draw, getCanvas, options } from "canvas-recorder/gl";
import { AmbientLight, Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";

import { Ribbon } from "./ribbon";

options( {
    size: [ 1024, 1024 ],
    frames: 60 * 6,
    record: false,
} )

const renderer = new WebGLRenderer( { canvas: getCanvas() } );
const camera = new PerspectiveCamera( 75, 1, 0.1, 10000 );
const scene = new Scene();
const ribbons: Ribbon[] = [];
const light = new AmbientLight( 0xffffff );

for ( var i = 0; i < 400; i++ ) {
    ribbons.push( new Ribbon() );
    scene.add( ribbons[ i ] );
}

renderer.setSize( 1024, 1024 );

camera.aspect = 1;
camera.updateProjectionMatrix();
camera.position.set( 0, 0, -10 );
camera.lookAt( 0, 0, 0 );

scene.add( light );
scene.background = new Color( 0xdddddd );

draw( ( _1, _2, t: number ) => {
    ribbons.forEach( ribbon => ribbon.update( t ) );

    renderer.render( scene, camera );
} );

bootstrap();