import { frame, stage } from "./stage";
import { Field } from "./field";
import { options, draw, start, getCanvas } from "canvas-recorder";

const field = new Field( frame );

options( {
    clear: true,
    size: [ stage.width, stage.height ],
    record: false,
    color: "white",
} );

draw( context => {
    field.render( context );
} );

document.body.appendChild( getCanvas() );

start();