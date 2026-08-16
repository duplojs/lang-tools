import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const emailConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.emailConstraintKind,
	{
		domain: "string",
		references: [{ typeName: "Email" }],
	},
);
