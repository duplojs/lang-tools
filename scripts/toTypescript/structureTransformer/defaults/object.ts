import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

const identifierRegex = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export const objectStructureTransformer = createStructureTransformer(
	(
		structure,
	): structure is DDataStructure.ObjectStructure => DDataStructure.structureIdentifier(
		structure,
		DDataStructure.objectStructureKind,
	),
	(
		structure,
		{
			transformer,
			includesUndefined,
			success,
		},
	) => {
		const typeElements: Typescript.TypeElement[] = [];

		for (const entry of structure.definition.shape.value) {
			const valueResult = transformer(entry.value);

			if (DEither.isLeft(valueResult)) {
				return valueResult;
			}

			const propertyName = identifierRegex.test(entry.key)
				? Typescript.factory.createIdentifier(entry.key)
				: Typescript.factory.createStringLiteral(entry.key);

			typeElements.push(
				Typescript.factory.createPropertySignature(
					[Typescript.factory.createModifier(Typescript.SyntaxKind.ReadonlyKeyword)],
					propertyName,
					includesUndefined(entry.value)
						? Typescript.factory.createToken(Typescript.SyntaxKind.QuestionToken)
						: undefined,
					DEither.unwrapRight(valueResult),
				),
			);
		}

		return success(
			Typescript.factory.createTypeLiteralNode(typeElements),
		);
	},
);
