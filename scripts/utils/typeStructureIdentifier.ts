import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DKind from "@duplojs/lang/kind";
import type * as DCommon from "@duplojs/lang/common";

export type TypeKindHandler = DDataStructure.Types extends infer InferredType
	? InferredType extends DDataStructure.Type
		? DKind.GetHandler<InferredType>
		: never
	: never;

export type TypeFromKindHandler<
	GenericTypeKind extends TypeKindHandler,
> = Extract<
	DDataStructure.Types,
	DKind.Kind<GenericTypeKind>
>;

export type IdentifiedTypeStructure<
	GenericType extends DDataStructure.Type,
> = DCommon.SimplifyType<(
	& DDataStructure.TypeStructure<
		DDataStructure.TypeValue<GenericType>
	>
	& {
		readonly definition: DDataStructure.TypeStructure["definition"] & {
			readonly type: GenericType;
		};
	}
)>;

export function typeStructureIdentifier<
	GenericTypeKind extends TypeKindHandler,
>(
	typeKind: GenericTypeKind,
): (
	typeStructure: DDataStructure.TypeStructure,
) => typeStructure is IdentifiedTypeStructure<
	TypeFromKindHandler<GenericTypeKind>
>;

export function typeStructureIdentifier<
	GenericTypeKind extends TypeKindHandler,
>(
	typeStructure: DDataStructure.TypeStructure,
	typeKind: GenericTypeKind,
): typeStructure is IdentifiedTypeStructure<
	TypeFromKindHandler<GenericTypeKind>
>;

export function typeStructureIdentifier(
	...args:
		| [typeKind: TypeKindHandler]
		| [structure: DDataStructure.TypeStructure, typeKind: TypeKindHandler]
): any {
	if (args.length === 1) {
		const [typeKind] = args;

		return (typeStructure: DDataStructure.TypeStructure) => typeStructureIdentifier(
			typeStructure,
			typeKind,
		);
	}

	const [typeStructure, typeKind] = args;

	return DDataStructure.typeIdentifier(
		typeStructure.definition.type,
		typeKind,
	);
}
