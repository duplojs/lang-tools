import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("objectStructureTransformer", () => {
	it("renders required, optional and quoted properties", () => {
		const structure = DDataStructure.object({
			id: DDataStructure.number(),
			"display-name": DDataStructure.string(),
			nickname: DDataStructure.optional(DDataStructure.string()),
		});

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("propagates an unsupported property", () => {
		expect(() => DStoTS.render(
			DDataStructure.object({ value: DDataStructure.string() }),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: [],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
