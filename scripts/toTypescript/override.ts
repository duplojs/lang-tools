import * as DDataStructure from "@duplojs/lang/dataStructure";
import type { Typescript } from "@scripts/typescript";
import type { AddImport, MapImportContextValue } from "./importContext";
import type { StructureTransformerBuildFunction } from "./structureTransformer";

export type MapImportContextEntry = readonly [
	path: string,
	value: MapImportContextValue,
];

export type TypescriptTransformerOverrideBuildFunction<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = StructureTransformerBuildFunction<GenericStructure>;

export type TypescriptTransformerOverride<
	GenericStructure extends DDataStructure.Structure = DDataStructure.Structure,
> = Typescript.TypeNode | TypescriptTransformerOverrideBuildFunction<GenericStructure>;

declare module "@duplojs/lang/dataStructure" {
	interface StructureDefinition {
		identifier?: string;
		overrideTypescriptTransformer?: TypescriptTransformerOverrideBuildFunction;
		mapImportContextEntries?: readonly MapImportContextEntry[];
	}

	interface Structure {
		setIdentifier(identifier: string): this;

		addIdentifier(identifier: string): this;

		setOverrideTypescriptTransformer(
			overrideTransformer: TypescriptTransformerOverride<this> | null,
		): this;

		addOverrideTypescriptTransformer(
			overrideTransformer: TypescriptTransformerOverride<this> | null,
		): this;

		setMapImportContextEntries(
			...entries: readonly MapImportContextEntry[]
		): this;

		addMapImportContextEntries(
			...entries: readonly MapImportContextEntry[]
		): this;
	}
}

export function applyMapImportContextEntries(
	addImport: AddImport,
	entries: readonly MapImportContextEntry[],
): void {
	for (const [path, imports] of entries) {
		for (const identifier of imports.namespace ?? []) {
			addImport(path, identifier, "namespace");
		}

		for (const identifier of imports.default ?? []) {
			addImport(path, identifier, "default");
		}

		for (const identifier of imports.direct ?? []) {
			addImport(path, identifier, "direct");
		}
	}
}

DDataStructure.StructureClass.addToPrototype(
	"setIdentifier",
	function(
		this: DDataStructure.Structure,
		identifier: string,
	) {
		this.definition.identifier = identifier;

		return this;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addIdentifier",
	function(
		this: DDataStructure.Structure,
		identifier: string,
	) {
		return this.clone().setIdentifier(identifier);
	},
);

DDataStructure.StructureClass.addToPrototype(
	"setOverrideTypescriptTransformer",
	function(
		this: DDataStructure.Structure,
		overrideTransformer: TypescriptTransformerOverride | null,
	) {
		if (overrideTransformer === null) {
			this.definition.overrideTypescriptTransformer = undefined;
		} else if (typeof overrideTransformer === "function") {
			this.definition.overrideTypescriptTransformer = overrideTransformer;
		} else {
			this.definition.overrideTypescriptTransformer = (
				_structure,
				{ success },
			) => success(overrideTransformer);
		}

		return this;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addOverrideTypescriptTransformer",
	function(
		this: DDataStructure.Structure,
		overrideTransformer: TypescriptTransformerOverride | null,
	) {
		return this.clone()
			.setOverrideTypescriptTransformer(overrideTransformer);
	},
);

DDataStructure.StructureClass.addToPrototype(
	"setMapImportContextEntries",
	function(
		this: DDataStructure.Structure,
		...entries: readonly MapImportContextEntry[]
	) {
		this.definition.mapImportContextEntries = entries;

		return this;
	},
);

DDataStructure.StructureClass.addToPrototype(
	"addMapImportContextEntries",
	function(
		this: DDataStructure.Structure,
		...entries: readonly MapImportContextEntry[]
	) {
		return this.clone()
			.setMapImportContextEntries(...entries);
	},
);
