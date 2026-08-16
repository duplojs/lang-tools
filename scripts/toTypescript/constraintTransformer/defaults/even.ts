import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const evenConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.evenConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "Even" }],
	},
);
