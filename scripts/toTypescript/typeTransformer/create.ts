import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";
import type { ImportKind, MapImportContext } from "../importContext";
import type { DataStructureErrorEither, TransformerEither, TransformerSuccessEither } from "../result";

export type { DataStructureErrorEither, DataStructureNotSupportedEither, TransformerSuccessEither } from "../result";
export type { ImportKind, MapImportContext, MapImportContextValue } from "../importContext";

export type MaybeTypeTransformerEither = TransformerEither;

export interface TypeTransformerParams {
	readonly importContext: MapImportContext;

	success(result: Typescript.TypeNode): TransformerSuccessEither;

	buildError(): DataStructureErrorEither;

	addImport(path: string, typeName: string, type?: ImportKind): void;
}

export type TypeTransformerBuildFunction<
	GenericStructure extends DDataStructure.TypeStructure = DDataStructure.TypeStructure,
> = (
	structure: GenericStructure,
	params: TypeTransformerParams,
) => MaybeTypeTransformerEither;

export type TypeTransformer = (
	structure: DDataStructure.TypeStructure,
	params: TypeTransformerParams,
) => MaybeTypeTransformerEither;

export function createTypeTransformer<
	GenericStructure extends DDataStructure.TypeStructure,
>(
	support: (
		structure: DDataStructure.TypeStructure,
	) => structure is GenericStructure,
	builder: TypeTransformerBuildFunction<GenericStructure>,
): TypeTransformer {
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
