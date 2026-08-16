import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const lessThanOrEqualConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.lessThanOrEqualConstraintKind,
	{
		domain: "number",
		references: [
			{
				typeName: "LessThanOrEqual",
				definitionKey: "threshold",
			},
		],
	},
);
