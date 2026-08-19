import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { constraintTransformer, type ConstraintTransformer } from "./constraintTransformer";
import type { MapContext } from "./context";
import { createAddImport, type MapImportContext } from "./importContext";
import { applyMapImportContextEntries } from "./override";
import type { TransformerEither, TransformerSuccessEither } from "./result";
import { structureTransformer, type StructureTransformer, type StructureTransformerParams } from "./structureTransformer";
import { typeTransformer, type TypeTransformer, type TypeTransformerParams } from "./typeTransformer";
import type { TransformerHook } from "./hook";
import { createIdentifier } from "./createIdentifier";

export interface TransformerFunctionParams {
	readonly identifier?: string;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly typeTransformers: readonly TypeTransformer[];
	readonly constraintTransformers: readonly ConstraintTransformer[];
	readonly context: MapContext;
	readonly importContext: MapImportContext;
	readonly hooks: readonly TransformerHook[];
	readonly recursiveDataStructures: readonly DDataStructure.Structure[];
}

export function transformer(
	structure: DDataStructure.Structure,
	params: TransformerFunctionParams,
): TransformerEither {
	const currentDataStructure = DArray.reduce(
		params.hooks,
		DArray.reduceFrom< DDataStructure.Structure>(structure),
		({ element: hook, lastValue, next, exit }) => {
			const result = hook({
				structure: lastValue,
				context: params.context,
				importContext: params.importContext,
				output: (action, structure) => ({
					structure,
					action,
				}),
			});

			if (result.action === "stop") {
				return exit(result.structure);
			} else {
				return next(result.structure);
			}
		},
	);

	const currentDeclaration = params.context.get(currentDataStructure);

	if (currentDeclaration) {
		return DEither.right(
			"buildSuccess",
			Typescript.factory.createTypeReferenceNode(
				currentDeclaration.name,
			),
		);
	}

	const currentIdentifier = DCommon.justExec(() => {
		if (
			!DArray.includes(params.recursiveDataStructures, currentDataStructure)
			&& !currentDataStructure.definition.identifier
		) {
			return undefined;
		}

		const identifier = currentDataStructure.definition.identifier !== undefined
			? createIdentifier(currentDataStructure.definition.identifier)
			: `RecursiveType${params.context.size}`;

		params.context.set(
			currentDataStructure,
			Typescript.factory.createTypeAliasDeclaration(
				[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
				Typescript.factory.createIdentifier(identifier),
				undefined,
				Typescript.factory.createTypeReferenceNode(
					identifier,
				),
			),
		);

		return identifier;
	});

	const structureTransformerParams: StructureTransformerParams = {
		success(result) {
			return DEither.right("buildSuccess", result);
		},
		transformer(structure) {
			return transformer(
				structure,
				params,
			);
		},
		transformConstraint: (constraint, structureTypeNode) => constraintTransformer(
			constraint,
			{
				transformers: params.constraintTransformers,
				structure: currentDataStructure,
				structureTypeNode,
				importContext: params.importContext,
			},
		),
		context: params.context,
		buildError() {
			return DEither.left("buildDataStructureError");
		},
		importContext: params.importContext,
		addImport: createAddImport(params.importContext),
	};

	const typeTransformerParams: TypeTransformerParams = {
		importContext: params.importContext,
		success: structureTransformerParams.success,
		buildError: structureTransformerParams.buildError,
		addImport: structureTransformerParams.addImport,
	};

	if (currentDataStructure.definition.mapImportContextEntries) {
		applyMapImportContextEntries(
			structureTransformerParams.addImport,
			currentDataStructure.definition.mapImportContextEntries,
		);
	}

	const result = DCommon.pipe(
		currentDataStructure,
		(dataStructure) => {
			if (dataStructure.definition.overrideTypescriptTransformer) {
				return dataStructure.definition.overrideTypescriptTransformer(
					currentDataStructure.addOverrideTypescriptTransformer(null),
					structureTransformerParams,
				);
			} else if (
				DDataStructure.structureIdentifier(
					currentDataStructure,
					DDataStructure.typeStructureKind,
				)
			) {
				return typeTransformer(
					currentDataStructure,
					{
						transformers: params.typeTransformers,
						transformerParams: typeTransformerParams,
					},
				);
			} else {
				return structureTransformer(
					currentDataStructure,
					{
						transformers: params.structureTransformers,
						transformerParams: structureTransformerParams,
					},
				);
			}
		},
		DCommon.when(
			DEither.hasInformation("buildSuccess"),
			(structureTypeNode) => {
				if (!DArray.minElements(currentDataStructure.definition.constraints, 1)) {
					return structureTypeNode;
				}

				const currentStructureTypeNode = DEither.unwrapRight(structureTypeNode);

				const constraintResult = DArray.reduce(
					currentDataStructure.definition.constraints,
					DArray.reduceFrom<TransformerSuccessEither[]>([]),
					({
						element: constraint,
						lastValue,
						nextPush,
						exit,
					}) => {
						const result = constraintTransformer(
							constraint,
							{
								transformers: params.constraintTransformers,
								structure: currentDataStructure,
								structureTypeNode: currentStructureTypeNode,
								importContext: params.importContext,
							},
						);

						if (DEither.isLeft(result)) {
							return exit(result);
						}

						return nextPush(lastValue, result);
					},
				);

				if (DEither.isLeft(constraintResult)) {
					return constraintResult;
				}

				const result = DArray.map(constraintResult, DEither.unwrapRight);

				return DEither.right(
					"buildSuccess",
					Typescript.factory.createIntersectionTypeNode([
						currentStructureTypeNode,
						...result,
					]),
				);
			},
		),
	);

	if (DEither.isLeft(result)) {
		return result;
	}

	if (currentIdentifier) {
		params.context.delete(currentDataStructure);

		params.context.set(
			currentDataStructure,
			Typescript.factory.createTypeAliasDeclaration(
				[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
				Typescript.factory.createIdentifier(currentIdentifier),
				undefined,
				DEither.unwrapRight(result),
			),
		);

		return DEither.right(
			"buildSuccess",
			Typescript.factory.createTypeReferenceNode(
				currentIdentifier,
			),
		);
	}

	return result;
}
