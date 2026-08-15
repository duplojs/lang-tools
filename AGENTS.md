# AGENTS

## Présentation

`@duplojs/lang-tools` regroupe des outils construits autour de `@duplojs/lang`.

Le projet sert d’espace de transformation, de génération, d’inspection et d’adaptation pour les concepts exposés par `@duplojs/lang`.

Il fonctionne comme un package qui regroupe plusieurs tools.

Les premiers outils ciblés sont :

- data structure vers TypeScript, pour produire des types et interfaces TypeScript depuis une data structure;
- data structure vers data structure, pour permettre à une instance runtime de data structure de se réécrire ou de réécrire sa propre déclaration;
- data structure vers JSON Schema, pour préparer de la documentation OpenAPI, alimenter des bases Swagger ou interfacer les data structures avec d’autres formats et langages.

Le projet commence avec une forte orientation autour des data structures et des transformeurs, mais il ne doit pas être limité à ce seul périmètre.

## Instructions obligatoires

Avant toute analyse ou modification, lire et appliquer :

- `.agents/mindset/collaboration.md`
- `.agents/rules/code.md`
- `.agents/rules/typescript.md`

Le mindset de collaboration s’applique à toutes les demandes.

Les règles de code et TypeScript s’appliquent à toute analyse, proposition ou modification liée au développement.

## Architecture

Le code est organisé par tools, exposés sous forme de namespaces ou de points d’entrée dédiés.

Chaque tool regroupe les fonctions, types et helpers liés à un même objectif.

Un tool peut par exemple représenter une transformation depuis une data structure vers une cible précise, comme TypeScript, une autre data structure ou JSON Schema.

Respecter l’architecture actuelle du dépôt. Ne pas créer, déplacer, fusionner ou supprimer un tool sans demande explicite.

## Organisation du dépôt

```text
scripts/
tests/
integrations/
```

- `scripts/` contient le code source;
- `tests/` contient les tests unitaires;
- `integrations/` contient les tests ou projets d’intégration lorsqu’ils sont nécessaires.

Le projet n’a pas vocation à maintenir une documentation publique ou une JSDoc dédiée par défaut. Les contrats sont principalement portés par l’API, les types, les tests et les exemples de tests.

Respecter les conventions d’organisation et d’import définies dans les règles de code.

## Dépendances runtime

Le projet ne possède pas de dépendance runtime propre.

`@duplojs/lang` est la peer dependency obligatoire du projet, puisque les tools travaillent autour de `@duplojs/lang`.

Les autres dépendances servent au build, aux tests, au lint ou au confort de développement. Ne pas ajouter de dépendance runtime sans demande explicite.

## Types utilitaires

Avant d’écrire un calcul de type complexe, rechercher les types utilitaires déjà disponibles dans le projet.

Préférer leur composition lorsqu’ils expriment clairement l’intention et évitent de réécrire un calcul existant.

## Skills

Pour toute création ou modification de tests unitaires, utiliser le skill dédié.

Ne pas charger ou enchaîner un skill hors du périmètre demandé.

## Commandes

Pour les validations et le build, utiliser les commandes existantes plutôt qu'une commande équivalente :

```bash
npm run test:types
npm run test:types:target [-- <fichier...>]
npm run test:lint [-- <chemin...>]
npm run test:lint:fix [-- <chemin...>]
npm run test:ut [-- <fichier-ou-filtre...>]
npm run build
```

`test:types` exécute une validation globale. `test:types:target` exécute une validation ciblée avec `tsconfig.test.json`.

Les autres commandes acceptent un ou plusieurs chemins lorsqu'un ciblage est utile.

Cette restriction ne concerne pas les commandes de lecture ou d'inspection comme `rg`, `sed`, `ls` ou `git diff`.

Ordre d’utilisation :

Utiliser librement `test:types:target` pendant le développement, de préférence avec un ou plusieurs fichiers ciblés.
Utiliser `test:types` seulement lorsqu'une validation globale est nécessaire.
Utiliser `test:lint:fix` sur les fichiers modifiés pour corriger et vérifier les conventions mécaniques.
Utiliser `test:lint` sans fix seulement lorsqu'un contrôle final ou un diagnostic sans modification est utile.
Lancer `test:ut` uniquement sur les tests concernés.
Utiliser `build` seulement lorsque la tâche affecte le build, les fichiers générés ou les tests d’intégration.

En `@brain` et `@step`, ne pas lancer une validation globale uniquement pour rechercher des impacts hors périmètre.
