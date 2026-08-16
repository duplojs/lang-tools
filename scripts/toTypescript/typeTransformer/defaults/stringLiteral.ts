import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

type StringLiteralStructure = DDataStructure.TypeStructure<string> & {
	readonly definition: DDataStructure.TypeStructure["definition"] & {
		readonly type: DDataStructure.StringLiteralType;
	};
};

export const stringLiteralTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is StringLiteralStructure => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.stringLiteralTypeKind,
	),
	(
		structure,
		{ success },
	) => success(
		Typescript.factory.createLiteralTypeNode(
			Typescript.factory.createStringLiteral(
				structure.definition.type.definition.value,
			),
		),
	),
);
