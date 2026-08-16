import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const strictNegativeConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.strictNegativeConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "StrictNegative" }],
	},
);
