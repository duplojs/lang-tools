import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const emailConstraintTransformer = createConstraintTransformer(
	(constraint) => DDataStructure.constraintIdentifier(
		constraint,
		DDataStructure.emailConstraintKind,
	),
	(_constraint, { success, addImport }) => {
		addImport("@duplojs/lang/string", "DString", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DString"),
					Typescript.factory.createIdentifier("Email"),
				),
			),
		);
	},
);
