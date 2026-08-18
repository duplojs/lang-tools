import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { ConstraintErrorEither, ConstraintNotSupportedEither, ConstraintTransformer } from "./constraintTransformer";
import type { MapContext } from "./context";
import type { TransformerHook } from "./hook";
import { createImportContext, type MapImportContext } from "./importContext";
import type { DataStructureErrorEither, DataStructureNotSupportedEither } from "./result";
import type { StructureTransformer } from "./structureTransformer";
import { transformer } from "./transformer";
import type { TypeTransformer } from "./typeTransformer";
import { getRecursiveDataStructure } from "@scripts/utils";
import { Typescript } from "@scripts/typescript";
import { createIdentifier } from "./createIdentifier";

export interface BuiltContext {
	readonly context: MapContext;
	readonly importContext: MapImportContext;
}

export interface BuildContextParams {
	readonly identifier: string;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly typeTransformers: readonly TypeTransformer[];
	readonly constraintTransformers: readonly ConstraintTransformer[];
	readonly context?: MapContext;
	readonly importContext?: MapImportContext;
	readonly hooks?: readonly TransformerHook[];
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
	const result = transformer(
		structure,
		{
			identifier: params.identifier,
			structureTransformers: params.structureTransformers,
			typeTransformers: params.typeTransformers,
			constraintTransformers: params.constraintTransformers,
			context,
			importContext,
			recursiveDataStructures: getRecursiveDataStructure(structure),
			hooks: params.hooks ?? [],
		},
	);

	if (DEither.isLeft(result)) {
		return result;
	}

	if (!structure.definition.identifier) {
		context.set(
			DDataStructure.undefined(),
			Typescript.factory.createTypeAliasDeclaration(
				[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
				Typescript.factory.createIdentifier(createIdentifier(params.identifier)),
				undefined,
				DEither.unwrapRight(result),
			),
		);
	} else if (structure.definition.identifier !== params.identifier) {
		context.set(
			DDataStructure.undefined(),
			Typescript.factory.createTypeAliasDeclaration(
				[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
				Typescript.factory.createIdentifier(createIdentifier(params.identifier)),
				undefined,
				Typescript.factory.createTypeReferenceNode(
					createIdentifier(structure.definition.identifier),
				),
			),
		);
	}

	return DEither.right(
		"buildSuccess",
		{
			context,
			importContext,
		},
	);
}
