import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const booleanTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is DDataStructure.TypeStructure<boolean> => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.booleanTypeKind,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.BooleanKeyword,
		),
	),
);
