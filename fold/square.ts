import { Vector2 } from "three";

export class Square {

    fromColor = "white";
    toColor = "black";

    private target = 0;
    private currentState = 1;
    private addValue = 0;
    private length = 0;

    constructor(
        private readonly size: Vector2,
        private readonly position: Vector2,
    ) {
        this.size.x = Math.ceil( this.size.x );
        this.size.y = Math.ceil( this.size.y );

        this.position.x = Math.floor( this.position.x );
        this.position.y = Math.floor( this.position.y );
    }

    reset() {
        this.currentState = 1;
        this.addValue = 0;
        this.length = 0;
        this.fromColor = "black";
        this.toColor = "white";
    }

    render( context: CanvasRenderingContext2D, state: number, animate: boolean = true ) {
        if ( state !== this.currentState ) {
            this.addValue = 0.03;
            this.currentState = state;
        }

        context.beginPath();
        context.fillStyle = this.toColor;
        context.rect( this.position.x, this.position.y, this.size.x, this.size.y );
        context.fill();

        this.length = Math.min( this.length +  this.addValue, 1 );

        const corner: Vector2 = this.position.clone().add(
            this.size.clone().multiplyScalar( animate ? this.length : state )
        );

        context.beginPath();
        context.moveTo( this.position.x, this.position.y );
        context.lineTo( this.position.x + this.size.x, this.position.y );
        context.lineTo( corner.x, corner.y );
        context.lineTo( this.position.x, this.position.y + this.size.y );
        context.lineTo( this.position.x, this.position.y );
        context.fillStyle = this.fromColor;
        context.fill();
    }
}