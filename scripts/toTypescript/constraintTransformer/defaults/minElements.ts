import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const minElementsConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.minElementsConstraintKind,
	{
		domain: "array",
		references: [
			{
				typeName: "MinElements",
				definitionKey: "min",
			},
		],
	},
);
