import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const positiveConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.positiveConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "Positive" }],
	},
);
