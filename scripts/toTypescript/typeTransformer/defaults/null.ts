import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";
import { typeStructureIdentifier } from "@scripts/utils";

export const nullTypeTransformer = createTypeTransformer(
	typeStructureIdentifier(
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
