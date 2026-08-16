import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const bigintTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is DDataStructure.TypeStructure<bigint> => DDataStructure.typeIdentifier(
		structure.definition.type,
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
