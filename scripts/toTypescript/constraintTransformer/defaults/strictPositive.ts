import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const strictPositiveConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.strictPositiveConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "StrictPositive" }],
	},
);
