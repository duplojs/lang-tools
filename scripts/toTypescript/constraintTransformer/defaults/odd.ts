import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const oddConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.oddConstraintKind,
	{
		domain: "number",
		references: [{ typeName: "Odd" }],
	},
);
