import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const stringLengthEqualConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.stringLengthEqualConstraintKind,
	{
		domain: "string",
		references: [
			{
				typeName: "LengthEqual",
				definitionKey: "length",
			},
		],
	},
);
