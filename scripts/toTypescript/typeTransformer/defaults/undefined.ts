import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const undefinedTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is DDataStructure.TypeStructure<undefined> => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.undefinedTypeKind,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.UndefinedKeyword,
		),
	),
);
