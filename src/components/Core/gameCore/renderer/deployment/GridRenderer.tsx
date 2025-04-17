import {TerrainType} from "../../types/TerrainType";
import {HexCoordinate} from "../../types/HexCoordinate";
import React from "react";
import {HighlightType} from '../../types/HighlightType';
import {HexCell} from "./HexCell/HexCell.tsx";
import {DeploymentCharacter} from "../../types/DeploymentCharacter";

interface Props {
	terrain: TerrainType,
	coordinate: HexCoordinate,
	highlight?: HighlightType | undefined,
	onDragOver?: (e: React.DragEvent) => void,
	onDrop?: (e: React.DragEvent) => void,
	deployedUnit?: DeploymentCharacter | null,
	onRightClick?: (coordinate: HexCoordinate, unit: DeploymentCharacter) => void,
}

export const GridRenderer: React.FC<Props> = ({
		terrain, coordinate, highlight=undefined, onDragOver, onDrop, deployedUnit, onRightClick
}) => {
	return (
		<HexCell terrain={terrain}
             coordinate={coordinate}
		         highlight={highlight}
		         onDragOver={onDragOver}
		         onDrop={onDrop}
		         deployedUnit={deployedUnit}
		         onRightClick={onRightClick} />
	)
}