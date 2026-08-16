import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const greaterThanConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.greaterThanConstraintKind,
	{
		domain: "number",
		references: [
			{
				typeName: "GreaterThan",
				definitionKey: "threshold",
			},
		],
	},
);
