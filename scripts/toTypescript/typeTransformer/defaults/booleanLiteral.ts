import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";
import { typeStructureIdentifier } from "@scripts/utils";

export const booleanLiteralTypeTransformer = createTypeTransformer(
	typeStructureIdentifier(
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
