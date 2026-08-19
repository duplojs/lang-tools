import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";
import { typeStructureIdentifier } from "@scripts/utils";

export const numberLiteralTypeTransformer = createTypeTransformer(
	typeStructureIdentifier(
		DDataStructure.numberLiteralTypeKind,
	),
	(
		structure,
		{
			success,
			buildError,
		},
	) => {
		const value = structure.definition.type.definition.value;

		if (!Number.isFinite(value)) {
			return buildError();
		}

		return success(
			Typescript.factory.createLiteralTypeNode(
				value < 0
					? Typescript.factory.createPrefixUnaryExpression(
						Typescript.SyntaxKind.MinusToken,
						Typescript.factory.createNumericLiteral(-value),
					)
					: Typescript.factory.createNumericLiteral(value),
			),
		);
	},
);
