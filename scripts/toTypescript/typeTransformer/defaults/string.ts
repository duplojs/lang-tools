import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const stringTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is DDataStructure.TypeStructure<string> => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.stringTypeKind,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.StringKeyword,
		),
	),
);
