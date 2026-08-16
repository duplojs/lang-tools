import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const arrayLengthEqualConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.arrayLengthEqualConstraintKind,
	{
		domain: "array",
		references: [
			{
				typeName: "LengthEqual",
				definitionKey: "length",
			},
		],
	},
);
