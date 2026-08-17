import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS, Typescript } from "@scripts";

describe("toTypescript imports", () => {
	it("clones, merges and deduplicates a prefilled import context", () => {
		const importContext = new Map([
			[
				"shared-package",
				{
					namespace: ["SharedNamespace"],
					default: ["SharedDefault"],
					direct: ["SharedType"],
				},
			],
			["empty-package", {}],
			[
				"set-package",
				{
					namespace: new Set(["SetNamespace"]),
					default: new Set(["SetDefault"]),
					direct: new Set(["SetType"]),
				},
			],
		] satisfies [string, DStoTS.MapImportContextValue][]);
		const structure = DDataStructure.string()
			.addMapImportContextEntries(
				[
					"shared-package",
					{
						namespace: ["SharedNamespace", "ExtraNamespace"],
						default: ["SharedDefault", "ExtraDefault"],
						direct: ["SharedType", "ExtraType"],
					},
				],
			)
			.addOverrideTypescriptTransformer(
				(_currentStructure, { addImport, success }) => {
					addImport("runtime-package", "RuntimeType");

					return success(Typescript.factory.createTypeReferenceNode("RuntimeType"));
				},
			);

		expect(DStoTS.render(
			structure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
				importContext,
			},
		)).toMatchSnapshot();
		expect(importContext.get("shared-package")).toEqual({
			namespace: ["SharedNamespace"],
			default: ["SharedDefault"],
			direct: ["SharedType"],
		});
		expect(importContext.has("runtime-package")).toBe(false);
	});
});
