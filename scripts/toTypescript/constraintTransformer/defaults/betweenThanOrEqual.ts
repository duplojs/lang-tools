import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const betweenThanOrEqualConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.betweenThanOrEqualConstraintKind,
	{
		domain: "number",
		references: [
			{
				typeName: "GreaterThanOrEqual",
				definitionKey: "greater",
			},
			{
				typeName: "LessThanOrEqual",
				definitionKey: "less",
			},
		],
	},
);
