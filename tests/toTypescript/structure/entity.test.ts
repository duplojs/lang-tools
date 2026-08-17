import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS } from "@scripts";

describe("entityStructureTransformer", () => {
	it("renders an entity structure", () => {
		const identifier = DModeling.NewTypeStructure("Identifier", DDataStructure.number(), []);
		const structure = DModeling.EntityStructure("User", () => ({
			id: identifier,
			name: DDataStructure.string(),
		}));

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("propagates an unsupported property", () => {
		const structure = DModeling.EntityStructure("User", () => ({
			name: DDataStructure.string(),
		}));

		expect(() => DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: [],
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});
});
