import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { TypeTransformer, TypeTransformerParams } from "./create";
import type { TransformerEither } from "../result";

export interface TypeTransformerFunctionParams {
	readonly transformers: readonly TypeTransformer[];
	readonly transformerParams: TypeTransformerParams;
}

export function typeTransformer(
	typeStructure: DDataStructure.TypeStructure,
	params: TypeTransformerFunctionParams,
): TransformerEither {
	for (const currentTransformer of params.transformers) {
		const result = currentTransformer(
			typeStructure,
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

	return DEither.left("dataStructureNotSupport", typeStructure);
}
