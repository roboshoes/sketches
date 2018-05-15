import { times } from "lodash";
import { Vector2 } from "three";

import { Column } from "./column";

const MARGIN = 10;
const COLUMNS = 13;

export class ColumnPool {

    private columns: Column[];

    constructor() {

        const width = ( ( 1024 - MARGIN ) / COLUMNS ) - MARGIN;

        this.columns = times( COLUMNS, ( i: number )  => new Column(
            new Vector2( MARGIN + i * ( width + MARGIN ), MARGIN ),
            new Vector2( width, 1024 - MARGIN * 2 ),
        ) );
    }

    calculate( t: number ) {
        this.columns.forEach( ( column: Column ) => column.calculate( t ) );
    }

    draw( context: CanvasRenderingContext2D ) {
        this.columns.forEach( ( column: Column ) => column.draw( context ) );
    }
}
