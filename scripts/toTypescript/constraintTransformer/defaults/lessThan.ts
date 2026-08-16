import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const lessThanConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.lessThanConstraintKind,
	{
		domain: "number",
		references: [
			{
				typeName: "LessThan",
				definitionKey: "threshold",
			},
		],
	},
);
