import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const taggedObjectStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DModeling.taggedObjectStructureKind,
	),
	(
		structure,
		{
			context,
			transformer,
			success,
			buildError,
			addImport,
		},
	) => {
		const placeholderDeclaration = context.get(structure);

		if (placeholderDeclaration === undefined) {
			return buildError();
		}

		const shape: DDataStructure.ShapeObjectStructure = {};

		for (const entry of structure.definition.inner.definition.shape.value) {
			if (entry.key !== DModeling.objectTagKind.runTimeKey) {
				shape[entry.key] = entry.value;
			}
		}

		const objectResult = transformer(DDataStructure.object(shape));

		if (DEither.isLeft(objectResult)) {
			return objectResult;
		}

		const objectTypeNode = DEither.unwrapRight(objectResult);

		if (!Typescript.isTypeLiteralNode(objectTypeNode)) {
			return buildError();
		}

		addImport("@duplojs/lang/modeling", "DModeling", "namespace");

		context.set(
			structure,
			Typescript.factory.createInterfaceDeclaration(
				[Typescript.factory.createModifier(Typescript.SyntaxKind.ExportKeyword)],
				placeholderDeclaration.name,
				undefined,
				[
					Typescript.factory.createHeritageClause(
						Typescript.SyntaxKind.ExtendsKeyword,
						[
							Typescript.factory.createExpressionWithTypeArguments(
								Typescript.factory.createPropertyAccessExpression(
									Typescript.factory.createIdentifier("DModeling"),
									Typescript.factory.createIdentifier("ObjectTag"),
								),
								[
									Typescript.factory.createLiteralTypeNode(
										Typescript.factory.createStringLiteral(structure.name),
									),
								],
							),
						],
					),
				],
				objectTypeNode.members,
			),
		);

		return success(
			Typescript.factory.createTypeReferenceNode(placeholderDeclaration.name),
		);
	},
);
