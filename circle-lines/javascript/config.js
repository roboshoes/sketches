import { Vector2 } from "three";

export const stage = new Vector2( 1024, 1024 );
export const ANCHORS = 30;
export const LINES = 40;
export const startTime = Date.now();

stage.center = stage.clone().divideScalar( 2 );