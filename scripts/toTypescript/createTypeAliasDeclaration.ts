import { Typescript } from "@scripts/typescript";

export function createTypeAliasDeclaration(
	identifier: string,
	typeNode: Typescript.TypeNode,
) {
	return Typescript.factory.createTypeAliasDeclaration(
		[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
		Typescript.factory.createIdentifier(identifier),
		undefined,
		typeNode,
	);
}
