import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const maxCharactersConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.maxCharactersConstraintKind,
	{
		domain: "string",
		references: [
			{
				typeName: "MaxCharacters",
				definitionKey: "max",
			},
		],
	},
);
