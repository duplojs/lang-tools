import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const dateTypeTransformer = createTypeTransformer(
	(
		structure,
	): structure is DDataStructure.TypeStructure => DDataStructure.typeIdentifier(
		structure.definition.type,
		DDataStructure.dateTypeKind,
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
					Typescript.factory.createIdentifier("TheDate"),
				),
			),
		);
	},
);
