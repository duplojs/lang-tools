import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer, typeStructureIdentifier } from "../create";

export const booleanLiteralTypeTransformer = createTypeTransformer(
	(structure) => typeStructureIdentifier(
		structure,
		DDataStructure.booleanLiteralTypeKind,
	),
	(
		structure,
		{ success },
	) => success(
		Typescript.factory.createLiteralTypeNode(
			structure.definition.type.definition.value
				? Typescript.factory.createTrue()
				: Typescript.factory.createFalse(),
		),
	),
);
