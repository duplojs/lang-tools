import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer, typeStructureIdentifier } from "../create";

export const undefinedTypeTransformer = createTypeTransformer(
	(structure) => typeStructureIdentifier(
		structure,
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
