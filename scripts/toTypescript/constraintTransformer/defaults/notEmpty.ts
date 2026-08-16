import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const notEmptyConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.notEmptyConstraintKind,
	{
		domain: "string",
		references: [{ typeName: "NotEmpty" }],
	},
);
