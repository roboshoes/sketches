import { Vector2 } from "three";

export class Rect extends Vector2 {
    constructor( anchor, size ) {
        super( anchor.x, anchor.y );

        this.anchor = anchor;
        this.size = size;
    }

    get width() {
        return this.size.width;
    }

    get height() {
        return this.size.height;
    }
}