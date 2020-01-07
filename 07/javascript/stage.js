import { Vector2 } from "three";
import { Rect } from "./math/rect";

export const dpi = window.devicePixelRatio || 2;

export function scaleDPI( value ) {
    return value * dpi;
}

export const stage = new Vector2( 1024 * dpi, 1024 * dpi );

export const frame = new Rect( new Vector2(), stage.clone() );