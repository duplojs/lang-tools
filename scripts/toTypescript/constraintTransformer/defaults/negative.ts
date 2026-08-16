import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const negativeConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.negativeConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "Negative" }],
	},
);
