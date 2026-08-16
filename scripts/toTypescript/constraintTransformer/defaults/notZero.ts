import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const notZeroConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.notZeroConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "NotZero" }],
	},
);
