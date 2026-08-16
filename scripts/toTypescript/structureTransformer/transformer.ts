import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { MaybeStructureTransformerEither, StructureTransformer, StructureTransformerParams } from "./create";

export interface StructureTransformerFunctionParams {
	readonly transformers: readonly StructureTransformer[];
	readonly transformerParams: StructureTransformerParams;
}

export function structureTransformer(
	structure: DDataStructure.Structure,
	params: StructureTransformerFunctionParams,
): MaybeStructureTransformerEither {
	for (const currentTransformer of params.transformers) {
		const result = currentTransformer(
			structure,
			params.transformerParams,
		);

		if (
			DEither.isLeft(result)
			&& DEither.hasInformation(result, "dataStructureNotSupport")
		) {
			continue;
		}

		return result;
	}

	return DEither.left("dataStructureNotSupport", structure);
}
