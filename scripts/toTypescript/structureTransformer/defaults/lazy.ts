import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createStructureTransformer } from "../create";

export const lazyStructureTransformer = createStructureTransformer(
	(
		structure,
	) => DDataStructure.structureIdentifier(
		structure,
		DDataStructure.lazyStructureKind,
	),
	(
		structure,
		{ transformer },
	) => transformer(structure.definition.getter.value),
);
