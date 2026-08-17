import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer, typeStructureIdentifier } from "../create";

export const bigintTypeTransformer = createTypeTransformer(
	(structure) => typeStructureIdentifier(
		structure,
		DDataStructure.bigintTypeKind,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.BigIntKeyword,
		),
	),
);
