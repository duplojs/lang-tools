import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";
import type { MapContext } from "../context";
import type { ImportKind, MapImportContext } from "../importContext";
import type { DataStructureErrorEither, TransformerEither, TransformerSuccessEither } from "../result";

export type { DataStructureErrorEither, DataStructureNotSupportedEither, TransformerSuccessEither } from "../result";
export type { ImportKind, MapImportContext, MapImportContextValue } from "../importContext";

export type MaybeStructureTransformerEither = TransformerEither;

export interface StructureTransformerParams {
	readonly context: MapContext;
	readonly importContext: MapImportContext;

	transformer(
		structure: DDataStructure.Structure,
	): MaybeStructureTransformerEither;

	success(result: Typescript.TypeNode): TransformerSuccessEither;

	transformConstraint(
		constraint: DDataStructure.Constraint,
		structureTypeNode: Typescript.TypeNode,
	): MaybeStructureTransformerEither;

	buildError(): DataStructureErrorEither;

	addImport(path: string, typeName: string, type?: ImportKind): void;
}

export type StructureTransformerBuildFunction<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = (
	structure: GenericStructure,
	params: StructureTransformerParams,
) => MaybeStructureTransformerEither;

export type StructureTransformer = (
	structure: DDataStructure.Structure,
	params: StructureTransformerParams,
) => MaybeStructureTransformerEither;

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
