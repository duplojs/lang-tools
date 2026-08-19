import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { MapContext } from "../context";
import type { DataStructureErrorEither, JsonSchema, SupportedVersions, TransformerEither, TransformerMode, TransformerSuccessEither } from "../result";
import type {

} from "./defaults";

export type TypeStructureJsonSchema = (
	| number
);

export interface TypeTransformerParams {
	readonly context: MapContext;
	readonly version: SupportedVersions;
	readonly mode: TransformerMode;

	success(result: JsonSchema): TransformerSuccessEither;

	buildError(): DataStructureErrorEither;
}

export type TypeTransformerBuildFunction<
	GenericTypeStructure extends DDataStructure.TypeStructure = DDataStructure.TypeStructure,
> = (
	typeStructure: GenericTypeStructure,
	params: TypeTransformerParams,
) => TransformerEither;

export type TypeTransformer = (
	typeStructure: DDataStructure.TypeStructure,
	params: TypeTransformerParams,
) => TransformerEither;

export function createTypeTransformer<
	GenericTypeStructure extends DDataStructure.TypeStructure,
>(
	support: (
		typeStructure: DDataStructure.TypeStructure,
	) => typeStructure is GenericTypeStructure,
	builder: TypeTransformerBuildFunction<GenericTypeStructure>,
): TypeTransformer {
	return (
		typeStructure,
		params,
	) => support(typeStructure)
		? builder(
			typeStructure,
			params,
		)
		: DEither.left("dataStructureNotSupport", typeStructure);
}
