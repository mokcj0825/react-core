import {TerrainType} from "../types/TerrainType";
import {HexCell} from "../component/HexCell/HexCell";
import {HexCoordinate} from "../types/HexCoordinate";
import React from "react";
import {HighlightType} from '../types/HighlightType';

interface Props {
	terrain: TerrainType,
	coordinate: HexCoordinate,
	highlight?: HighlightType | undefined,
}

export const GridRenderer: React.FC<Props> = ({
		terrain, coordinate, highlight=undefined
}) => {
	return (
		<HexCell terrain={terrain}
             coordinate={coordinate}
		         highlight={highlight} />
	)
}