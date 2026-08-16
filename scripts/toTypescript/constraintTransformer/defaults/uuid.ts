import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const uuidConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.uuidConstraintKind,
	{
		domain: "string",
		references: [{ typeName: "Uuid" }],
	},
);
