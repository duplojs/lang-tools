import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const recordStructureTransformer = createStructureTransformer(
	(
		structure,
	) => DDataStructure.structureIdentifier(
		structure,
		DDataStructure.recordStructureKind,
	),
	(
		structure,
		{
			transformer,
			includesUndefined,
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

		const recordTypeNode = Typescript.factory.createTypeReferenceNode(
			"Readonly",
			[
				Typescript.factory.createTypeReferenceNode(
					"Record",
					[
						DEither.unwrapRight(keyResult),
						DEither.unwrapRight(valueResult),
					],
				),
			],
		);

		return success(
			structure.definition.requiredKeys === null
			|| includesUndefined(structure.definition.value)
				? Typescript.factory.createTypeReferenceNode(
					"Partial",
					[recordTypeNode],
				)
				: recordTypeNode,
		);
	},
);
