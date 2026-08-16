const invalidIdentifierPartRegExp = /[^A-Za-z0-9_$]+(?<nextCharacter>.)?/g;
const validIdentifierStartRegExp = /^[A-Za-z_$]/;

export function createIdentifier(identifier: string): string {
	const camelCasedIdentifier = identifier
		.trim()
		.replace(
			invalidIdentifierPartRegExp,
			(__, nextCharacter: string | undefined) => nextCharacter?.toUpperCase() ?? "",
		);
	const capitalizedIdentifier = camelCasedIdentifier.length === 0
		? "Type"
		: `${camelCasedIdentifier[0]!.toUpperCase()}${camelCasedIdentifier.slice(1)}`;

	return validIdentifierStartRegExp.test(capitalizedIdentifier)
		? capitalizedIdentifier
		: `_${capitalizedIdentifier}`;
}
