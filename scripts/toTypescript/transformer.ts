import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import type { StructureAnalysis } from "./analysis";
import { constraintTransformer, type ConstraintTransformer } from "./constraintTransformer";
import type { MapContext } from "./context";
import { createTypeAliasDeclaration } from "./createTypeAliasDeclaration";
import { createAddImport, type MapImportContext } from "./importContext";
import { applyMapImportContextEntries } from "./override";
import type { TransformerEither } from "./result";
import { structureTransformer, type StructureTransformer, type StructureTransformerParams } from "./structureTransformer";
import { typeTransformer, type TypeTransformer, type TypeTransformerParams } from "./typeTransformer";

export interface TransformerFunctionParams {
	readonly identifier?: string;
	readonly analysis: StructureAnalysis;
	readonly structureTransformers: readonly StructureTransformer[];
	readonly typeTransformers: readonly TypeTransformer[];
	readonly constraintTransformers: readonly ConstraintTransformer[];
	readonly context: MapContext;
	readonly importContext: MapImportContext;
}

export function transformer(
	structure: DDataStructure.Structure,
	params: TransformerFunctionParams,
): TransformerEither {
	const activeOverrideStructures = new WeakSet<DDataStructure.Structure>();
	const transform = (
		inputStructure: DDataStructure.Structure,
		requestedIdentifier?: string,
	): TransformerEither => {
		const currentStructure = params.analysis.analyze(inputStructure);
		const currentDeclaration = params.context.get(currentStructure);
		const isTypeStructure = DDataStructure.structureIdentifier(
			currentStructure,
			DDataStructure.typeStructureKind,
		);

		if (currentDeclaration) {
			return DEither.right(
				"buildSuccess",
				Typescript.factory.createTypeReferenceNode(currentDeclaration.name),
			);
		}

		const explicitIdentifier = params.analysis.getIdentifier(currentStructure);
		const needsDeclaration = explicitIdentifier !== undefined
			|| (
				!isTypeStructure
				&& (
					requestedIdentifier !== undefined
					|| params.analysis.recursiveStructures.has(currentStructure)
				)
			);
		const currentIdentifier = needsDeclaration
			? explicitIdentifier
				?? requestedIdentifier
				?? params.analysis.getRecursiveIdentifier(currentStructure)
			: undefined;
		const placeholderDeclaration = currentIdentifier === undefined
			? undefined
			: createTypeAliasDeclaration(
				currentIdentifier,
				Typescript.factory.createTypeReferenceNode(currentIdentifier),
			);

		if (placeholderDeclaration) {
			params.context.set(currentStructure, placeholderDeclaration);
		}

		const standardStructureTransformerParams: StructureTransformerParams = {
			context: params.context,
			importContext: params.importContext,
			transformer: (nextStructure) => transform(nextStructure),
			includesUndefined: params.analysis.includesUndefined,
			transformConstraint: (constraint, structureTypeNode) => constraintTransformer(
				constraint,
				{
					transformers: params.constraintTransformers,
					structure: currentStructure,
					structureTypeNode,
					importContext: params.importContext,
				},
			),
			success: (typeNode) => DEither.right("buildSuccess", typeNode),
			buildError: () => DEither.left("buildDataStructureError", currentStructure),
			addImport: createAddImport(params.importContext),
		};
		const standardTypeTransformerParams: TypeTransformerParams = {
			importContext: params.importContext,
			success: standardStructureTransformerParams.success,
			buildError: standardStructureTransformerParams.buildError,
			addImport: standardStructureTransformerParams.addImport,
		};

		if (currentStructure.definition.mapImportContextEntries) {
			applyMapImportContextEntries(
				standardStructureTransformerParams.addImport,
				currentStructure.definition.mapImportContextEntries,
			);
		}

		const defaultTransformer = () => isTypeStructure
			? typeTransformer(
				currentStructure,
				{
					transformers: params.typeTransformers,
					transformerParams: standardTypeTransformerParams,
				},
			)
			: structureTransformer(
				currentStructure,
				{
					transformers: params.structureTransformers,
					transformerParams: standardStructureTransformerParams,
				},
			);
		const runTransformer = (): TransformerEither => {
			const overrideTransformer = activeOverrideStructures.has(currentStructure)
				? undefined
				: currentStructure.definition.overrideTypescriptTransformer;

			if (overrideTransformer === undefined) {
				return defaultTransformer();
			}

			activeOverrideStructures.add(currentStructure);

			try {
				return overrideTransformer(
					currentStructure,
					standardStructureTransformerParams,
				);
			} finally {
				activeOverrideStructures.delete(currentStructure);
			}
		};
		let result = runTransformer();

		if (!DEither.isLeft(result)) {
			const structureTypeNode = DEither.unwrapRight(result);
			const constraintTypeNodes: Typescript.TypeNode[] = [];

			for (const constraint of currentStructure.definition.constraints) {
				const constraintResult = standardStructureTransformerParams.transformConstraint(
					constraint,
					structureTypeNode,
				);

				if (DEither.isLeft(constraintResult)) {
					result = constraintResult;
					break;
				}

				constraintTypeNodes.push(DEither.unwrapRight(constraintResult));
			}

			if (
				!DEither.isLeft(result)
				&& constraintTypeNodes.length !== 0
			) {
				result = DEither.right(
					"buildSuccess",
					Typescript.factory.createIntersectionTypeNode([
						structureTypeNode,
						...constraintTypeNodes,
					]),
				);
			}
		}

		if (DEither.isLeft(result)) {
			if (
				placeholderDeclaration
				&& params.context.get(currentStructure) === placeholderDeclaration
			) {
				params.context.delete(currentStructure);
			}

			return result;
		}

		if (currentIdentifier) {
			const contextDeclaration = params.context.get(currentStructure);

			if (
				contextDeclaration !== undefined
				&& contextDeclaration !== placeholderDeclaration
			) {
				return result;
			}

			params.context.set(
				currentStructure,
				createTypeAliasDeclaration(
					currentIdentifier,
					DEither.unwrapRight(result),
				),
			);

			return DEither.right(
				"buildSuccess",
				Typescript.factory.createTypeReferenceNode(currentIdentifier),
			);
		}

		return result;
	};

	return transform(
		structure,
		params.identifier,
	);
}
