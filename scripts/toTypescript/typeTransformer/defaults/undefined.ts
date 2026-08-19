import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";
import { typeStructureIdentifier } from "@scripts/utils";

export const undefinedTypeTransformer = createTypeTransformer(
	typeStructureIdentifier(
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
