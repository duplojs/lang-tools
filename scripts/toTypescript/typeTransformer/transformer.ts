import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { MaybeTypeTransformerEither, TypeTransformer, TypeTransformerParams } from "./create";

export interface TypeTransformerFunctionParams {
	readonly transformers: readonly TypeTransformer[];
	readonly transformerParams: TypeTransformerParams;
}

export function typeTransformer(
	structure: DDataStructure.TypeStructure,
	params: TypeTransformerFunctionParams,
): MaybeTypeTransformerEither {
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
