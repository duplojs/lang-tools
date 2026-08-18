import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS, Typescript } from "@scripts";

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

	it("detects undefined values from contextual declarations during render", () => {
		const contextualStructure = DDataStructure.object({
			value: DDataStructure.string(),
		});
		const aliasStructure = DDataStructure.object({
			value: DDataStructure.number(),
		});
		const context = new Map<
			DDataStructure.Structure,
			DStoTS.ContextDeclaration
		>([
			[
				contextualStructure,
				Typescript.factory.createInterfaceDeclaration(
					[],
					"ContextValue",
					undefined,
					[],
					[
						Typescript.factory.createMethodSignature(
							undefined,
							"ping",
							undefined,
							[],
							[],
							Typescript.factory.createKeywordTypeNode(
								Typescript.SyntaxKind.StringKeyword,
							),
						),
						Typescript.factory.createPropertySignature(
							undefined,
							"missingType",
							undefined,
							undefined,
						),
						Typescript.factory.createPropertySignature(
							undefined,
							"payload",
							undefined,
							Typescript.factory.createUnionTypeNode([
								Typescript.factory.createKeywordTypeNode(
									Typescript.SyntaxKind.StringKeyword,
								),
								Typescript.factory.createKeywordTypeNode(
									Typescript.SyntaxKind.UndefinedKeyword,
								),
							]),
						),
					],
				),
			],
			[
				aliasStructure,
				Typescript.factory.createTypeAliasDeclaration(
					[],
					"AliasValue",
					undefined,
					Typescript.factory.createKeywordTypeNode(
						Typescript.SyntaxKind.StringKeyword,
					),
				),
			],
		]);

		expect(DStoTS.render(
			DDataStructure.object({ root: contextualStructure }),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
				context,
			},
		)).toContain("readonly root?: ContextValue;");
		expect(DStoTS.render(
			DDataStructure.object({ alias: aliasStructure }),
			{
				identifier: "ValueAlias",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
				context,
			},
		)).toContain("readonly alias: AliasValue;");
		expect(DStoTS.contextDeclarationIncludesUndefined({} as never)).toBe(false);
	});
});
