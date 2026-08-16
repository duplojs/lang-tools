import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { type Typescript } from "@scripts/typescript";
import { createStructureAnalysis } from "./analysis";
import type { ConstraintErrorEither, ConstraintNotSupportedEither, ConstraintTransformer } from "./constraintTransformer";
import type { MapContext } from "./context";
import { createTypeAliasDeclaration } from "./createTypeAliasDeclaration";
import type { TransformerHook } from "./hook";
import { createImportContext, type MapImportContext } from "./importContext";
import type { DataStructureErrorEither, DataStructureNotSupportedEither } from "./result";
import type { StructureTransformer } from "./structureTransformer";
import { transformer } from "./transformer";
import type { TypeTransformer } from "./typeTransformer";

export interface BuiltContext {
	readonly context: MapContext;
	readonly importContext: MapImportContext;
	readonly rootDeclaration?: Typescript.TypeAliasDeclaration;
}

export interface BuildContextParams {
	readonly identifier: string;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly typeTransformers: readonly TypeTransformer[];
	readonly constraintTransformers: readonly ConstraintTransformer[];
	readonly context?: MapContext;
	readonly hooks?: readonly TransformerHook[];
	readonly importContext?: MapImportContext;
}

export function buildContext(
	structure: DDataStructure.Structure,
	params: BuildContextParams,
): (
	| DEither.Right<"buildSuccess", BuiltContext>
	| DataStructureNotSupportedEither
	| DataStructureErrorEither
	| ConstraintNotSupportedEither
	| ConstraintErrorEither
) {
	const context: MapContext = new Map(params.context);
	const importContext = createImportContext(params.importContext);
	const analysis = createStructureAnalysis(
		structure,
		{
			identifier: params.identifier,
			context,
			hooks: params.hooks ?? [],
			importContext,
		},
	);
	const result = transformer(
		analysis.rootStructure,
		{
			identifier: analysis.rootIdentifier,
			analysis,
			structureTransformers: params.structureTransformers,
			typeTransformers: params.typeTransformers,
			constraintTransformers: params.constraintTransformers,
			context,
			importContext,
		},
	);

	if (DEither.isLeft(result)) {
		return result;
	}

	const structureDeclaration = context.get(analysis.rootStructure);
	const rootDeclaration = structureDeclaration?.name.text === analysis.rootIdentifier
		? undefined
		: createTypeAliasDeclaration(
			analysis.rootIdentifier,
			DEither.unwrapRight(result),
		);

	return DEither.right(
		"buildSuccess",
		{
			context,
			importContext,
			rootDeclaration,
		},
	);
}
