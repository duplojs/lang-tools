import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const urlConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.urlConstraintKind,
	{
		domain: "string",
		references: [{ typeName: "Url" }],
	},
);
