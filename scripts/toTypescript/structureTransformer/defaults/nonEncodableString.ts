import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DKind from "@duplojs/lang/kind";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

interface NonEncodableStringStructure extends DDataStructure.Structure {
	readonly definition: DDataStructure.Structure["definition"] & {
		readonly value: string;
	};
}

const nonEncodableStringStructureKind = DKind
	.createNamespace("DuplojsLangDataStructure")(
		"non-encodable-string-structure",
	);

export const nonEncodableStringStructureTransformer = createStructureTransformer(
	(
		structure,
	): structure is NonEncodableStringStructure => nonEncodableStringStructureKind.has(
		structure,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createTypeReferenceNode("String"),
	),
);
