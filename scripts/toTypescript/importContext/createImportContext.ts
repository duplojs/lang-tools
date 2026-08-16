import type { ImportIdentifiers, MapImportContext, MapImportContextValue } from "./types";

function createIdentifiers(
	identifiers: ImportIdentifiers | undefined,
): Set<string> | undefined {
	return identifiers === undefined
		? undefined
		: new Set(identifiers);
}

function createImportContextValue(
	value: MapImportContextValue,
): MapImportContextValue {
	return {
		namespace: createIdentifiers(value.namespace),
		default: createIdentifiers(value.default),
		direct: createIdentifiers(value.direct),
	};
}

export function createImportContext(
	importContext?: ReadonlyMap<string, MapImportContextValue>,
): MapImportContext {
	return new Map(
		[...(importContext ?? [])].map(
			([path, value]) => [path, createImportContextValue(value)],
		),
	);
}
