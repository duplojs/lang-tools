import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";
import { typeStructureIdentifier } from "@scripts/utils";

export const timeTypeTransformer = createTypeTransformer(
	typeStructureIdentifier(
		DDataStructure.timeTypeKind,
	),
	(
		_structure,
		{
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/lang/chrono", "DChrono", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DChrono"),
					Typescript.factory.createIdentifier("TheTime"),
				),
			),
		);
	},
);
