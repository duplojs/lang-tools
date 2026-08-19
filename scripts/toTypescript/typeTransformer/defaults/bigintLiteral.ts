import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";
import { typeStructureIdentifier } from "@scripts/utils";

export const bigintLiteralTypeTransformer = createTypeTransformer(
	typeStructureIdentifier(
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
