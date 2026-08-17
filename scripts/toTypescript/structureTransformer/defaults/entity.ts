import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const entityStructureTransformer = createStructureTransformer(
	(
		structure,
	) => DDataStructure.structureIdentifier(
		structure,
		DModeling.entityStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
			addImport,
		},
	) => {
		const shape: DDataStructure.ShapeObjectStructure = {};

		for (const entry of structure.definition.inner.value.definition.shape.value) {
			if (entry.key !== DModeling.entityKind.runTimeKey) {
				shape[entry.key] = entry.value;
			}
		}

		const objectResult = transformer(DDataStructure.object(shape));

		if (DEither.isLeft(objectResult)) {
			return objectResult;
		}

		addImport("@duplojs/lang/modeling", "DModeling", "namespace");

		return success(
			Typescript.factory.createIntersectionTypeNode([
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createQualifiedName(
						Typescript.factory.createIdentifier("DModeling"),
						Typescript.factory.createIdentifier("Entity"),
					),
					[
						Typescript.factory.createLiteralTypeNode(
							Typescript.factory.createStringLiteral(structure.name),
						),
					],
				),
				DEither.unwrapRight(objectResult),
			]),
		);
	},
);
