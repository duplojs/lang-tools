import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS, Typescript } from "@scripts";

describe("toTypescript override", () => {
	it("adds override metadata without mutating the source structure", () => {
		const sourceStructure = DDataStructure.string();
		const structure = sourceStructure
			.addIdentifier("ExternalValue")
			.addOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("ExternalType"),
			)
			.addMapImportContextEntries(
				["namespace-package", { namespace: ["NamespaceValue"] }],
				["default-package", { default: ["DefaultValue"] }],
				["direct-package", { direct: ["ExternalType"] }],
			);

		expect(sourceStructure.definition.identifier).toBeUndefined();
		expect(sourceStructure.definition.overrideTypescriptTransformer).toBeUndefined();
		expect(sourceStructure.definition.mapImportContextEntries).toBeUndefined();
		expect(structure).not.toBe(sourceStructure);
		expect(DStoTS.render(
			DDataStructure.array(structure),
			{
				identifier: "Values",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("sets override metadata on the current structure", () => {
		const structure = DDataStructure.string()
			.setIdentifier("CurrentValue")
			.setMapImportContextEntries([
				"direct-package",
				{ direct: ["CurrentType"] },
			])
			.setOverrideTypescriptTransformer(
				(_currentStructure, { success }) => success(
					Typescript.factory.createTypeReferenceNode("CurrentType"),
				),
			);

		expect(structure.definition.identifier).toBe("CurrentValue");
		expect(DStoTS.render(
			structure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("delegates to the standard transformer", () => {
		const structure = DDataStructure.string()
			.addOverrideTypescriptTransformer(
				(currentStructure, { transformer }) => transformer(currentStructure),
			);

		expect(DStoTS.render(
			structure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("removes an override with null", () => {
		const structure = DDataStructure.string()
			.setOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("ExternalType"),
			)
			.setOverrideTypescriptTransformer(null);
		const clonedStructure = structure.addOverrideTypescriptTransformer(null);

		expect(structure.definition.overrideTypescriptTransformer).toBeUndefined();
		expect(clonedStructure.definition.overrideTypescriptTransformer).toBeUndefined();
		expect(clonedStructure).not.toBe(structure);
		expect(DStoTS.render(
			clonedStructure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("does not create an alias when root identifier matches structure identifier", () => {
		const structure = DDataStructure.string()
			.setIdentifier("SameValue");

		const rendered = DStoTS.render(
			structure,
			{
				identifier: "SameValue",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		);

		const exportLines = rendered.split("\n").filter((line) => line.startsWith("export type"));
		expect(exportLines).toHaveLength(1);
	});
});
