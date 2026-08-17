import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer, typeStructureIdentifier } from "../create";

export const nullTypeTransformer = createTypeTransformer(
	(structure) => typeStructureIdentifier(
		structure,
		DDataStructure.nullTypeKind,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createLiteralTypeNode(
			Typescript.factory.createNull(),
		),
	),
);
