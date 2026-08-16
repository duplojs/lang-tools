import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const greaterThanOrEqualConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.greaterThanOrEqualConstraintKind,
	{
		domain: "number",
		references: [
			{
				typeName: "GreaterThanOrEqual",
				definitionKey: "threshold",
			},
		],
	},
);
