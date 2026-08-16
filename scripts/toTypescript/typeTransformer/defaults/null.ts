import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const nullTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is DDataStructure.TypeStructure<null> => DDataStructure.typeIdentifier(
		structure.definition.type,
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
