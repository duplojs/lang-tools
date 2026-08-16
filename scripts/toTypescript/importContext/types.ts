export type ImportIdentifiers = readonly string[] | ReadonlySet<string>;

export interface MapImportContextValue {
	namespace?: ImportIdentifiers;
	default?: ImportIdentifiers;
	direct?: ImportIdentifiers;
}

export type MapImportContext = Map<string, MapImportContextValue>;

export type ImportKind = "default" | "namespace" | "direct";
