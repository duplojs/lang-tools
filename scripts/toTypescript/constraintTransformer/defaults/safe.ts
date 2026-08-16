import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const safeConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.safeConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "Safe" }],
	},
);
