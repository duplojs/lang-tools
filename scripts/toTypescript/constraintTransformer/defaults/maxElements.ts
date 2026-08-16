import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const maxElementsConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.maxElementsConstraintKind,
	{
		domain: "array",
		references: [
			{
				typeName: "MaxElements",
				definitionKey: "max",
			},
		],
	},
);
