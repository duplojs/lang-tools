import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { MapContext } from "../context";
import type { DataStructureErrorEither, JsonSchema, SupportedVersions, TransformerEither, TransformerMode, TransformerSuccessEither } from "../result";
import type {

} from "./defaults";

export type StructureJsonSchema = (
	| string
);

export interface StructureTransformerParams {
	readonly context: MapContext;
	readonly version: SupportedVersions;
	readonly mode: TransformerMode;

	transformer(structure: DDataStructure.Structure): TransformerEither;

	success(result: JsonSchema): TransformerSuccessEither;

	buildError(): DataStructureErrorEither;
}

export type StructureTransformerBuildFunction<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = (
	structure: GenericStructure,
	params: StructureTransformerParams,
) => TransformerEither;

export type StructureTransformer = (
	structure: DDataStructure.Structure,
	params: StructureTransformerParams,
) => TransformerEither;

export function createStructureTransformer<
	GenericStructure extends DDataStructure.Structure,
>(
	support: (
		structure: DDataStructure.Structure,
	) => structure is GenericStructure,
	builder: StructureTransformerBuildFunction<GenericStructure>,
): StructureTransformer {
	return (
		structure,
		params,
	) => support(structure)
		? builder(
			structure,
			params,
		)
		: DEither.left("dataStructureNotSupport", structure);
}
