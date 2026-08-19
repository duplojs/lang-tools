import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";
import type { ImportKind, MapImportContext } from "../importContext";
import type { DataStructureErrorEither, TransformerEither, TransformerSuccessEither } from "../result";

export interface TypeTransformerParams {
	readonly importContext: MapImportContext;

	success(result: Typescript.TypeNode): TransformerSuccessEither;

	buildError(): DataStructureErrorEither;

	addImport(path: string, typeName: string, type?: ImportKind): void;
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
