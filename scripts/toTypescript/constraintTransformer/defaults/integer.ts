import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const integerConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.integerConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "Integer" }],
	},
);
