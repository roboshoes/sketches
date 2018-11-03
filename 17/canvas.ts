import { CanvasTexture, LinearFilter, Texture } from "three";

export class Canvas {
    private canvas: HTMLCanvasElement;
    private texture: Texture;
    private context: CanvasRenderingContext2D;

    private readonly SIZE = 512;
    private readonly LINE_HEIGHT = 110;
    private readonly FONT_SIZE = 90;

    constructor() {
        this.canvas = document.createElement( "canvas" );
        this.context = this.canvas.getContext( "2d" );
        this.canvas.width = this.SIZE;
        this.canvas.height = this.SIZE;

        this.texture = new CanvasTexture( this.canvas );
        this.texture.minFilter = LinearFilter;

        this.context.fillStyle = "rgba( 0, 0, 0, 1 )";
        this.context.fillRect( 0, 0, this.SIZE, this.SIZE );
    }

    write( value: string ): void {
        this.context.fillStyle = "rgba( 255, 0, 0, 1 )";
        this.context.font = `bold ${ this.FONT_SIZE }px Arial`;
        this.context.textBaseline = "middle";

        const words = value.split( "\n" );

        words.forEach( ( word: string, i: number ) => {
            const offset = ( words.length - 1 ) / 2;
            this.context.fillText( word, 10, this.SIZE / 2 - offset * this.LINE_HEIGHT + i * this.LINE_HEIGHT );
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
