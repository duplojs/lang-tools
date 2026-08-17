import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import { DStoTS, Typescript } from "@scripts";

describe("taggedObjectStructureTransformer", () => {
	it("renders a tagged object as an interface", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			id: DDataStructure.number(),
			name: DDataStructure.string(),
		});

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});

	it("propagates an unsupported property", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			name: DDataStructure.string(),
		});

		expect(() => DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: [],
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});

	it("rejects a missing declaration placeholder", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			name: DDataStructure.string(),
		});
		const removePlaceholderTransformer: DStoTS.StructureTransformer = (
			currentStructure,
			params,
		) => {
			if (DDataStructure.structureIdentifier(currentStructure, DModeling.taggedObjectStructureKind)) {
				params.context.delete(currentStructure);
			}

			return DEither.left("dataStructureNotSupport", currentStructure);
		};

		expect(() => DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: [
				removePlaceholderTransformer,
				...DStoTS.defaultStructureTransformers,
			],
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});

	it("rejects a transformed inner structure that is not an object type", () => {
		const structure = DModeling.TaggedObjectStructure("User", {
			name: DDataStructure.string(),
		});
		const objectAsStringTransformer = DStoTS.createStructureTransformer(
			(currentStructure) => DDataStructure.structureIdentifier(
				currentStructure,
				DDataStructure.objectStructureKind,
			),
			(_currentStructure, { success }) => success(
				Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.StringKeyword),
			),
		);

		expect(() => DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: [
				objectAsStringTransformer,
				...DStoTS.defaultStructureTransformers,
			],
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toThrowErrorMatchingSnapshot();
	});
});
