import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";
import { typeStructureIdentifier } from "@scripts/utils";

export const stringLiteralTypeTransformer = createTypeTransformer(
	typeStructureIdentifier(
		DDataStructure.stringLiteralTypeKind,
	),
	(
		structure,
		{ success },
	) => success(
		Typescript.factory.createLiteralTypeNode(
			Typescript.factory.createStringLiteral(
				structure.definition.type.definition.value,
			),
		),
	),
);
