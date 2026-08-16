import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { Typescript } from "@scripts/typescript";
import type { ImportKind, MapImportContext } from "../importContext";
import type { ConstraintErrorEither, ConstraintNotSupportedEither, TransformerSuccessEither } from "../result";

export type { ConstraintErrorEither, ConstraintNotSupportedEither } from "../result";

export type ConstraintTransformerSuccessEither = TransformerSuccessEither;

export type MaybeConstraintTransformerEither =
	| ConstraintTransformerSuccessEither
	| ConstraintNotSupportedEither
	| ConstraintErrorEither;

export interface ConstraintTransformerParams {
	readonly structure: DDataStructure.Structure;
	readonly structureTypeNode: Typescript.TypeNode;
	readonly importContext: MapImportContext;

	success(result: Typescript.TypeNode): ConstraintTransformerSuccessEither;

	buildError(): ConstraintErrorEither;

	addImport(path: string, typeName: string, type?: ImportKind): void;
}

export type ConstraintTransformerBuildFunction<
	GenericConstraint extends DDataStructure.Constraint = DDataStructure.Constraint,
> = (
	constraint: GenericConstraint,
	params: ConstraintTransformerParams,
) => MaybeConstraintTransformerEither;

export type ConstraintTransformer = (
	constraint: DDataStructure.Constraint,
	params: ConstraintTransformerParams,
) => MaybeConstraintTransformerEither;

export function createConstraintTransformer<
	GenericConstraint extends DDataStructure.Constraint,
>(
	support: (
		constraint: DDataStructure.Constraint,
	) => constraint is GenericConstraint,
	builder: ConstraintTransformerBuildFunction<GenericConstraint>,
): ConstraintTransformer {
	return (
		constraint,
		params,
	) => support(constraint)
		? builder(
			constraint,
			params,
		)
		: DEither.left("constraintNotSupport", constraint);
}
