import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DKind from "@duplojs/lang/kind";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer, type ConstraintTransformer } from "../create";

type ConstraintDomain = "array" | "number" | "string";

interface ConstraintReference {
	readonly typeName: string;
	readonly definitionKey?: string;
}

interface CreateDefaultConstraintTransformerParams {
	readonly domain: ConstraintDomain;
	readonly references: readonly ConstraintReference[];
}

const domainParams = {
	array: {
		path: "@duplojs/lang/array",
		namespace: "DArray",
	},
	number: {
		path: "@duplojs/lang/number",
		namespace: "DNumber",
	},
	string: {
		path: "@duplojs/lang/string",
		namespace: "DString",
	},
} as const;

function createNumberLiteralTypeNode(
	value: number,
): Typescript.LiteralTypeNode | undefined {
	if (!Number.isFinite(value)) {
		return undefined;
	}

	return Typescript.factory.createLiteralTypeNode(
		value < 0
			? Typescript.factory.createPrefixUnaryExpression(
				Typescript.SyntaxKind.MinusToken,
				Typescript.factory.createNumericLiteral(-value),
			)
			: Typescript.factory.createNumericLiteral(value),
	);
}

export function createDefaultConstraintTransformer(
	kind: DKind.Handler,
	params: CreateDefaultConstraintTransformerParams,
): ConstraintTransformer {
	return createConstraintTransformer(
		(
			constraint,
		): constraint is DDataStructure.Constraint => kind.has(constraint),
		(
			constraint,
			{
				success,
				buildError,
				addImport,
			},
		) => {
			const currentDomainParams = domainParams[params.domain];
			const definition = constraint.definition as Record<string, unknown>;
			const typeNodes: Typescript.TypeNode[] = [];

			for (const reference of params.references) {
				const typeArguments: Typescript.TypeNode[] = [];

				if (reference.definitionKey !== undefined) {
					const value = definition[reference.definitionKey];

					if (typeof value !== "number") {
						return buildError();
					}

					const typeArgument = createNumberLiteralTypeNode(value);

					if (typeArgument === undefined) {
						return buildError();
					}

					typeArguments.push(typeArgument);
				}

				typeNodes.push(
					Typescript.factory.createTypeReferenceNode(
						Typescript.factory.createQualifiedName(
							Typescript.factory.createIdentifier(currentDomainParams.namespace),
							Typescript.factory.createIdentifier(reference.typeName),
						),
						typeArguments,
					),
				);
			}

			if (typeNodes.length === 0) {
				return buildError();
			}

			addImport(
				currentDomainParams.path,
				currentDomainParams.namespace,
				"namespace",
			);

			return success(
				typeNodes.length === 1
					? typeNodes[0]!
					: Typescript.factory.createIntersectionTypeNode(typeNodes),
			);
		},
	);
}
