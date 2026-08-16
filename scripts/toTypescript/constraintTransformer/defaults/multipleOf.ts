import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createDefaultConstraintTransformer } from "./createDefaultConstraintTransformer";

export const multipleOfConstraintTransformer = createDefaultConstraintTransformer(
	DDataStructure.multipleOfConstraintKind,
	{
		domain: "number",
		references: [
			{
				typeName: "MultipleOf",
				definitionKey: "multiple",
			},
		],
	},
);
