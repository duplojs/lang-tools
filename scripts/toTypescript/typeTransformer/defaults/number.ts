import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const numberTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is DDataStructure.TypeStructure<number> => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.numberTypeKind,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.NumberKeyword,
		),
	),
);
