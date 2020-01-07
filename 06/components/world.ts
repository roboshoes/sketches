import { AmbientLight, DirectionalLight, Scene, Vector3 } from "three";

import { Block } from "./cube";

export class World extends Scene {

    private blocks: Block[] = [];
    private readonly SIZE = 30;
    private time: number = 0;

    constructor() {
        super();

        this.buildField();
        this.buildLight();
    }

    private buildField() {
        const halfSize = this.SIZE / 2;
        let block: Block;

        for ( let x = -halfSize; x <= halfSize; x++ ) {
            for ( let y = -halfSize; y <= halfSize; y++ ) {
                block = new Block();
                block.position.set( x * 10, 0, y * 10 );
                block.update();

                this.add( block );
                this.blocks.push( block );
            }
        }
    }

    private buildLight() {
        const ambient = new AmbientLight( 0xF1F1F1, 0.7 );
        const point = new DirectionalLight( 0xFFFFFF, 0.4 );

        point.position.set( 0, 300, 300 );
        point.lookAt( new Vector3() );

        this.add( point, ambient );
    }

    private extrude() {
        this.blocks.forEach( ( block: Block ) => {
            block.extrude( this.time );
        } );
    }

    loop() {
        const progress = 0.002;

        this.time = ( this.time + progress ) % 1;
        this.extrude();
        this.rotateY( progress * Math.PI * 2 );
    }
}
