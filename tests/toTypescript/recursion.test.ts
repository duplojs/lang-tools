import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("toTypescript recursion", () => {
	it("renders a nested recursive structure with an automatic identifier", () => {
		const recursiveStructure: DDataStructure.Structure = DDataStructure.union([
			DDataStructure.number(),
			DDataStructure.array(
				DDataStructure.lazy(() => recursiveStructure),
			),
		]);

		expect(DStoTS.render(
			DDataStructure.array(recursiveStructure),
			{
				identifier: "Values",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("skips identifiers already reserved by the root declaration", () => {
		const recursiveStructure: DDataStructure.Structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.lazy(() => recursiveStructure),
		]);

		expect(DStoTS.render(
			DDataStructure.array(recursiveStructure),
			{
				identifier: "RecursiveType1",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("renders mutually recursive structures", () => {
		const structureStore: Partial<Record<"first" | "second", DDataStructure.Structure>> = {};
		const firstStructure = DDataStructure.object({
			name: DDataStructure.string(),
			next: DDataStructure.lazy(() => structureStore.second!),
		});
		const secondStructure = DDataStructure.object({
			value: DDataStructure.number(),
			next: DDataStructure.lazy(() => structureStore.first!),
		});

		structureStore.first = firstStructure;
		structureStore.second = secondStructure;

		expect(DStoTS.render(
			DDataStructure.array(firstStructure),
			{
				identifier: "Values",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("propagates undefined through a recursive union", () => {
		const recursiveStructure: DDataStructure.Structure = DDataStructure.union([
			DDataStructure.string(),
			DDataStructure.undefined(),
			DDataStructure.array(DDataStructure.lazy(() => recursiveStructure)),
		]);

		expect(DStoTS.render(
			DDataStructure.object({ value: recursiveStructure }),
			{
				identifier: "Container",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});
});
