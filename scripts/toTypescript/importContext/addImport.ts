import type { ImportKind, MapImportContext } from "./types";

export type AddImport = (
	path: string,
	typeName: string,
	type?: ImportKind,
) => void;

export function createAddImport(
	importContext: MapImportContext,
): AddImport {
	return (
		path,
		typeName,
		type = "direct",
	) => {
		const imports = importContext.get(path) ?? {};
		const currentIdentifiers = imports[type];

		if (currentIdentifiers instanceof Set) {
			currentIdentifiers.add(typeName);
			return;
		}
		const identifiers = new Set(currentIdentifiers);

		identifiers.add(typeName);

		importContext.set(
			path,
			{
				...imports,
				[type]: identifiers,
			},
		);
	};
}
