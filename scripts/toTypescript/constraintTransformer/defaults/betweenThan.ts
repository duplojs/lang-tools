import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const betweenThanConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.betweenThanConstraintKind,
	{
		domain: "number",
		references: [
			{
				typeName: "GreaterThan",
				definitionKey: "greater",
			},
			{
				typeName: "LessThan",
				definitionKey: "less",
			},
		],
	},
);
