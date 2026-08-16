import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const minCharactersConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.stringMinConstraintKind,
	{
		domain: "string",
		references: [
			{
				typeName: "MinCharacters",
				definitionKey: "min",
			},
		],
	},
);
