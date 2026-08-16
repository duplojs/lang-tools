import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createStructureTransformer } from "../create";

export const lazyStructureTransformer = createStructureTransformer(
	(
		structure,
	): structure is DDataStructure.LazyStructure => DDataStructure.structureIdentifier(
		structure,
		DDataStructure.lazyStructureKind,
	),
	(
		structure,
		{ transformer },
	) => transformer(structure.definition.getter.value),
);
