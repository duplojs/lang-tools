import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import type { MapContext } from "./context";
import { createIdentifier } from "./createIdentifier";
import type { TransformerHook } from "./hook";
import type { MapImportContext } from "./importContext";

export interface StructureAnalysis {
	readonly rootIdentifier: string;
	readonly rootStructure: DDataStructure.Structure;
	readonly recursiveStructures: ReadonlySet<DDataStructure.Structure>;

	analyze(structure: DDataStructure.Structure): DDataStructure.Structure;

	getIdentifier(structure: DDataStructure.Structure): string | undefined;

	getRecursiveIdentifier(structure: DDataStructure.Structure): string;

	includesUndefined(structure: DDataStructure.Structure): boolean;
}

export interface CreateStructureAnalysisParams {
	readonly identifier: string;
	readonly context: MapContext;
	readonly hooks: readonly TransformerHook[];
	readonly importContext: MapImportContext;
}

function isNewTypeStructure(
	structure: DDataStructure.Structure,
): structure is DModeling.NewTypeStructure {
	return DModeling.newTypeStructureKind.has(structure);
}

function isEntityStructure(
	structure: DDataStructure.Structure,
): structure is DModeling.EntityStructure {
	return DModeling.entityStructureKind.has(structure);
}

function getChildren(
	structure: DDataStructure.Structure,
): readonly DDataStructure.Structure[] {
	if (isNewTypeStructure(structure)) {
		return [structure.definition.inner];
	}

	if (isEntityStructure(structure)) {
		return [structure.definition.inner.value];
	}

	if (
		DDataStructure.structureIdentifier(
			structure,
			DDataStructure.arrayStructureKind,
		)
	) {
		return [structure.definition.element];
	}

	if (
		DDataStructure.structureIdentifier(
			structure,
			DDataStructure.objectStructureKind,
		)
	) {
		return structure.definition.shape.value.map(({ value }) => value);
	}

	if (
		DDataStructure.structureIdentifier(
			structure,
			DDataStructure.recordStructureKind,
		)
	) {
		return [
			structure.definition.key,
			structure.definition.value,
		];
	}

	if (
		DDataStructure.structureIdentifier(
			structure,
			DDataStructure.unionStructureKind,
		)
	) {
		return structure.definition.values;
	}

	if (
		DDataStructure.structureIdentifier(
			structure,
			DDataStructure.lazyStructureKind,
		)
	) {
		return [structure.definition.getter.value];
	}

	return [];
}

function getUndefinedChildren(
	structure: DDataStructure.Structure,
): readonly DDataStructure.Structure[] {
	if (
		DDataStructure.structureIdentifier(
			structure,
			DDataStructure.unionStructureKind,
		)
	) {
		return structure.definition.values;
	}

	if (
		DDataStructure.structureIdentifier(
			structure,
			DDataStructure.lazyStructureKind,
		)
	) {
		return [structure.definition.getter.value];
	}

	return [];
}

export function createStructureAnalysis(
	structure: DDataStructure.Structure,
	params: CreateStructureAnalysisParams,
): StructureAnalysis {
	const resolvedStructures = new WeakMap<
		DDataStructure.Structure,
		DDataStructure.Structure
	>();
	const structureIdentifiers = new Map<DDataStructure.Structure, string>();
	const usedIdentifiers = new Set(
		[...params.context.values()].map(({ name }) => name.text),
	);
	const visitedStructures = new Set<DDataStructure.Structure>();
	const visitingStructures = new Set<DDataStructure.Structure>();
	const recursiveStructures = new Set<DDataStructure.Structure>();
	const structuresIncludingUndefined = new Set<DDataStructure.Structure>();
	const undefinedParents = new Map<
		DDataStructure.Structure,
		Set<DDataStructure.Structure>
	>();
	const pendingUndefinedStructures: DDataStructure.Structure[] = [];
	let recursiveIdentifierIndex = 1;

	for (const [contextStructure, declaration] of params.context) {
		structureIdentifiers.set(contextStructure, declaration.name.text);
	}

	const allocateIdentifier = (input: string): string => {
		const baseIdentifier = createIdentifier(input);

		if (!usedIdentifiers.has(baseIdentifier)) {
			usedIdentifiers.add(baseIdentifier);
			return baseIdentifier;
		}

		let suffix = 2;
		let identifier = `${baseIdentifier}${suffix}`;

		while (usedIdentifiers.has(identifier)) {
			suffix++;
			identifier = `${baseIdentifier}${suffix}`;
		}

		usedIdentifiers.add(identifier);

		return identifier;
	};
	const resolveStructure = (
		inputStructure: DDataStructure.Structure,
	): DDataStructure.Structure => {
		const resolvedStructure = resolvedStructures.get(inputStructure);

		if (resolvedStructure !== undefined) {
			return resolvedStructure;
		}

		let currentStructure = inputStructure;

		for (const hook of params.hooks) {
			const result = hook({
				structure: currentStructure,
				context: params.context,
				importContext: params.importContext,
				output: (action, nextStructure) => ({
					structure: nextStructure,
					action,
				}),
			});

			currentStructure = result.structure;

			if (result.action === "stop") {
				break;
			}
		}

		resolvedStructures.set(inputStructure, currentStructure);
		resolvedStructures.set(currentStructure, currentStructure);

		return currentStructure;
	};
	const rootIdentifier = allocateIdentifier(params.identifier);
	const rootStructure = resolveStructure(structure);
	const reserveStructureIdentifier = (
		currentStructure: DDataStructure.Structure,
	): void => {
		if (
			structureIdentifiers.has(currentStructure)
			|| currentStructure.definition.identifier === undefined
		) {
			return;
		}

		const identifier = createIdentifier(currentStructure.definition.identifier);

		structureIdentifiers.set(
			currentStructure,
			currentStructure === rootStructure && identifier === rootIdentifier
				? rootIdentifier
				: allocateIdentifier(identifier),
		);
	};
	const markAsIncludingUndefined = (
		currentStructure: DDataStructure.Structure,
	): void => {
		if (structuresIncludingUndefined.has(currentStructure)) {
			return;
		}

		structuresIncludingUndefined.add(currentStructure);
		pendingUndefinedStructures.push(currentStructure);
	};
	const propagateUndefined = (): void => {
		while (pendingUndefinedStructures.length !== 0) {
			for (const currentStructure of pendingUndefinedStructures.splice(0)) {
				for (const parentStructure of undefinedParents.get(currentStructure) ?? []) {
					markAsIncludingUndefined(parentStructure);
				}
			}
		}
	};
	const registerUndefinedDependencies = (
		currentStructure: DDataStructure.Structure,
	): void => {
		if (DDataStructure.isUndefinedStructure(currentStructure)) {
			markAsIncludingUndefined(currentStructure);
			return;
		}

		for (const childStructure of getUndefinedChildren(currentStructure)) {
			const resolvedChildStructure = resolveStructure(childStructure);
			const parents = undefinedParents.get(resolvedChildStructure) ?? new Set();

			parents.add(currentStructure);
			undefinedParents.set(resolvedChildStructure, parents);

			if (structuresIncludingUndefined.has(resolvedChildStructure)) {
				markAsIncludingUndefined(currentStructure);
			}
		}
	};
	const visit = (
		inputStructure: DDataStructure.Structure,
	): DDataStructure.Structure => {
		const currentStructure = resolveStructure(inputStructure);

		if (visitingStructures.has(currentStructure)) {
			recursiveStructures.add(currentStructure);
			return currentStructure;
		}

		if (visitedStructures.has(currentStructure)) {
			return currentStructure;
		}

		visitingStructures.add(currentStructure);
		reserveStructureIdentifier(currentStructure);
		registerUndefinedDependencies(currentStructure);

		for (const childStructure of getChildren(currentStructure)) {
			visit(childStructure);
		}

		visitingStructures.delete(currentStructure);
		visitedStructures.add(currentStructure);

		return currentStructure;
	};
	const analyze = (
		inputStructure: DDataStructure.Structure,
	): DDataStructure.Structure => {
		const currentStructure = visit(inputStructure);

		propagateUndefined();

		return currentStructure;
	};

	analyze(structure);

	return {
		rootIdentifier,
		rootStructure,
		recursiveStructures,
		analyze,
		getIdentifier(currentStructure) {
			const analyzedStructure = analyze(currentStructure);
			return structureIdentifiers.get(analyzedStructure);
		},
		getRecursiveIdentifier(currentStructure) {
			const analyzedStructure = analyze(currentStructure);
			const currentIdentifier = structureIdentifiers.get(analyzedStructure);

			if (currentIdentifier !== undefined) {
				return currentIdentifier;
			}

			let identifier = `RecursiveType${recursiveIdentifierIndex}`;

			while (usedIdentifiers.has(identifier)) {
				recursiveIdentifierIndex++;
				identifier = `RecursiveType${recursiveIdentifierIndex}`;
			}

			recursiveIdentifierIndex++;
			usedIdentifiers.add(identifier);
			structureIdentifiers.set(analyzedStructure, identifier);

			return identifier;
		},
		includesUndefined(currentStructure) {
			const analyzedStructure = analyze(currentStructure);
			return structuresIncludingUndefined.has(analyzedStructure);
		},
	};
}
