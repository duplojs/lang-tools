import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer, typeStructureIdentifier } from "../create";

export const timeTypeTransformer = createTypeTransformer(
	(structure) => typeStructureIdentifier(
		structure,
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
