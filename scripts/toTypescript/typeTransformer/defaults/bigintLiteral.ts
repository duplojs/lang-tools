import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

type BigintLiteralStructure = DDataStructure.TypeStructure<bigint> & {
	readonly definition: DDataStructure.TypeStructure["definition"] & {
		readonly type: DDataStructure.BigintLiteralType;
	};
};

export const bigintLiteralTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is BigintLiteralStructure => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.bigintLiteralTypeKind,
	),
	(
		structure,
		{ success },
	) => {
		const value = structure.definition.type.definition.value;

		return success(
			Typescript.factory.createLiteralTypeNode(
				value < 0n
					? Typescript.factory.createPrefixUnaryExpression(
						Typescript.SyntaxKind.MinusToken,
						Typescript.factory.createBigIntLiteral(`${-value}n`),
					)
					: Typescript.factory.createBigIntLiteral(`${value}n`),
			),
		);
	},
);
