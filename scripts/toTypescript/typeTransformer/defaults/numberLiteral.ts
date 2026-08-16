import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

type NumberLiteralStructure = DDataStructure.TypeStructure<number> & {
	readonly definition: DDataStructure.TypeStructure["definition"] & {
		readonly type: DDataStructure.NumberLiteralType;
	};
};

export const numberLiteralTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is NumberLiteralStructure => DDataStructure.typeIdentifier(
		structure.definition.type,
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
