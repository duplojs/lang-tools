import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

type BooleanLiteralStructure = DDataStructure.TypeStructure<boolean> & {
	readonly definition: DDataStructure.TypeStructure["definition"] & {
		readonly type: DDataStructure.BooleanLiteralType;
	};
};

export const booleanLiteralTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is BooleanLiteralStructure => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.booleanLiteralTypeKind,
	),
	(
		structure,
		{ success },
	) => success(
		Typescript.factory.createLiteralTypeNode(
			structure.definition.type.definition.value
				? Typescript.factory.createTrue()
				: Typescript.factory.createFalse(),
		),
	),
);
