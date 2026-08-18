import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";
import { includesUndefinedTypeNode } from "@scripts/toTypescript";

export const recordStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.recordStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const keyResult = transformer(structure.definition.key);

		if (DEither.isLeft(keyResult)) {
			return keyResult;
		}

		const valueResult = transformer(structure.definition.value);

		if (DEither.isLeft(valueResult)) {
			return valueResult;
		}

		const valueTypeNode = DEither.unwrapRight(valueResult);

		const recordTypeNode = Typescript.factory.createTypeReferenceNode(
			"Readonly",
			[
				Typescript.factory.createTypeReferenceNode(
					"Record",
					[
						DEither.unwrapRight(keyResult),
						valueTypeNode,
					],
				),
			],
		);

		return success(
			structure.definition.requiredKeys === null
			|| includesUndefinedTypeNode(valueTypeNode)
				? Typescript.factory.createTypeReferenceNode(
					"Partial",
					[recordTypeNode],
				)
				: recordTypeNode,
		);
	},
);
