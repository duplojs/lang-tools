import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("recordStructureTransformer", () => {
	it("renders required and partial records", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.record(DDataStructure.literal("key"), DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(DDataStructure.string(), DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(DDataStructure.literal("key"), DDataStructure.optional(DDataStructure.number())), params),
		]).toMatchSnapshot();
	});

	it("propagates an unsupported key", () => {
		expect(() => DStoTS.render(
			DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: [],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("propagates an unsupported value", () => {
		expect(() => DStoTS.render(
			DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: [DStoTS.stringTypeTransformer],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
