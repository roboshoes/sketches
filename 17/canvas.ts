import { Texture } from "three";

export class Canvas {
    private canvas: HTMLCanvasElement;
    private texture: Texture;
    private context: CanvasRenderingContext2D;

    private readonly SIZE = 512;

    constructor() {
        this.canvas = document.createElement( "canvas" );
        this.context = this.canvas.getContext( "2d" );
        this.texture = new Texture( this.canvas );

        this.canvas.width = this.SIZE;
        this.canvas.height = this.SIZE;

        this.context.fillStyle = "black";
        this.context.fillRect( 0, 0, this.SIZE, this.SIZE );
    }

    write( value: string ): void {
        this.context.fillStyle = "white";
        this.context.font = "bold 80px Arial";
        this.context.textBaseline = "middle";

        const words = value.split( "\n" );

        words.forEach( ( word: string, i: number ) => {
            const offset = Math.floor( words.length / 2 );
            this.context.fillText( word, 10, this.SIZE / 2 - offset * 70 + i * 70 );
        } );

        this.texture.needsUpdate = true;
    }

    getTexture(): Texture {
        return this.texture;
    }

    getElement(): HTMLCanvasElement {
        return this.canvas;
    }
}
