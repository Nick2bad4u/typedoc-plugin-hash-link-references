import * as nodePath from "node:path";
import {
    arrayFirst,
    isEmpty,
    objectValues,
    safeCastTo,
    setHas,
} from "ts-extras";
import {
    type Application,
    type Comment,
    type CommentDisplayPart,
    Converter,
    DeclarationReflection,
    type ProjectReflection,
    type Reflection,
    ReflectionKind,
    SignatureReflection,
} from "typedoc";

import { convertHashLinksToBangLinksInInlineTagText } from "./core.js";

// TypeDoc's built-in LinkResolverPlugin runs at priority -300. This plugin must
// run before it, so its priority must be higher.
const RUN_BEFORE_LINK_RESOLVER_PRIORITY = 50;
const loadedApplications = new WeakSet<Readonly<Application>>();
const INLINE_LINK_TAGS: ReadonlySet<`@${string}`> = new Set([
    "@link",
    "@linkcode",
    "@linkplain",
]);

interface ParsedPathLink {
    label: string;
    moduleSource: string;
    symbolName: string;
}

/**
 * TypeDoc plugin entrypoint.
 *
 * @param app - TypeDoc app instance.
 */
export function load(app: Readonly<Application>): void {
    if (loadedApplications.has(app)) {
        return;
    }

    app.converter.on(
        Converter.EVENT_RESOLVE_END,
        (context) => {
            const reflectionTargetsByName = indexSourceReflections(
                context.project
            );

            for (const reflection of objectValues(
                context.project.reflections
            )) {
                if (reflection.comment) {
                    convertAndResolveHashLinksInComment(
                        reflection.comment,
                        reflection,
                        reflectionTargetsByName
                    );
                }
            }
        },
        RUN_BEFORE_LINK_RESOLVER_PRIORITY
    );
    loadedApplications.add(app);
}

/**
 * Convert one supported inline link and resolve its source-backed target.
 *
 * @param readonlyPart - Comment display part to process.
 * @param owner - Reflection which owns the part.
 * @param reflectionTargetsByName - Source-backed reflections keyed by name.
 */
function convertAndResolveHashLinkInPart(
    readonlyPart: Readonly<CommentDisplayPart>,
    owner: Readonly<Reflection>,
    reflectionTargetsByName: ReadonlyMap<string, readonly Reflection[]>
): void {
    const part = safeCastTo<CommentDisplayPart>(readonlyPart);

    if (part.kind !== "inline-tag" || !setHas(INLINE_LINK_TAGS, part.tag)) {
        return;
    }

    const originalText = part.text;
    const rewrittenText =
        convertHashLinksToBangLinksInInlineTagText(originalText);

    if (rewrittenText === originalText) {
        return;
    }

    part.text = rewrittenText;
    delete part.target;
    delete part.tsLinkText;

    const parsedLink = parsePathLink(originalText);
    if (!parsedLink) {
        return;
    }

    const target = resolvePathLinkTarget(
        parsedLink,
        owner,
        reflectionTargetsByName
    );
    if (target) {
        part.target = target;
        part.text = parsedLink.label || target.name;
    }
}

/**
 * Convert supported inline links and attach a concrete reflection target when
 * the module source names a source file.
 *
 * TypeDoc treats text before `!` as a literal module name, not a file path.
 * Attaching the matching reflection lets file-oriented authoring links resolve
 * without relying on an invalid declaration-reference module source.
 *
 * @param comment - Comment whose links should be processed.
 * @param owner - Reflection which owns the comment.
 * @param reflectionTargetsByName - Source-backed reflections keyed by name.
 */
function convertAndResolveHashLinksInComment(
    comment: Readonly<Comment>,
    owner: Readonly<Reflection>,
    reflectionTargetsByName: ReadonlyMap<string, readonly Reflection[]>
): void {
    convertAndResolveHashLinksInParts(
        comment.summary,
        owner,
        reflectionTargetsByName
    );

    for (const tag of comment.blockTags) {
        convertAndResolveHashLinksInParts(
            tag.content,
            owner,
            reflectionTargetsByName
        );
    }
}

/**
 * Convert supported inline-link parts and resolve simple `path#Symbol`
 * references to source-backed TypeDoc reflections.
 *
 * @param parts - Comment display parts to process.
 * @param owner - Reflection which owns the parts.
 * @param reflectionTargetsByName - Source-backed reflections keyed by name.
 */
function convertAndResolveHashLinksInParts(
    parts: readonly Readonly<CommentDisplayPart>[],
    owner: Readonly<Reflection>,
    reflectionTargetsByName: ReadonlyMap<string, readonly Reflection[]>
): void {
    for (const part of parts) {
        convertAndResolveHashLinkInPart(part, owner, reflectionTargetsByName);
    }
}

/**
 * Read every concrete source path associated with a reflection.
 *
 * @param reflection - Reflection to inspect.
 *
 * @returns Absolute or normalized source file paths.
 */
function getReflectionSourcePaths(
    reflection: Readonly<Reflection>
): readonly string[] {
    if (
        !(reflection instanceof DeclarationReflection) &&
        !(reflection instanceof SignatureReflection)
    ) {
        return [];
    }

    return (
        reflection.sources?.flatMap((source) => [
            source.fullFileName,
            source.fileName,
        ]) ?? []
    );
}

/**
 * Index reflections which TypeDoc associated with concrete source files.
 *
 * @param project - Converted TypeDoc project.
 *
 * @returns Source-backed reflections grouped by reflection name.
 */
function indexSourceReflections(
    project: Readonly<ProjectReflection>
): ReadonlyMap<string, readonly Reflection[]> {
    const index = new Map<string, Reflection[]>();

    for (const reflection of objectValues(project.reflections)) {
        if (isEmpty(getReflectionSourcePaths(reflection))) {
            continue;
        }

        const matchingName = index.get(reflection.name);
        if (matchingName) {
            matchingName.push(reflection);
        } else {
            index.set(reflection.name, [reflection]);
        }
    }

    return index;
}

/**
 * Check whether a target reflection is declared by the referenced source file.
 *
 * Root-relative authoring paths are matched against source suffixes. Explicit
 * relative paths are also resolved from every source associated with the
 * comment owner.
 *
 * @param candidate - Potential target reflection.
 * @param owner - Reflection which owns the link.
 * @param moduleSource - File path written before the hash.
 *
 * @returns Whether the candidate is declared in the referenced file.
 */
function isReflectionDeclaredByModuleSource(
    candidate: Readonly<Reflection>,
    owner: Readonly<Reflection>,
    moduleSource: string
): boolean {
    const normalizedModuleSource = normalizeSourcePath(moduleSource);
    const suffixModuleSource = normalizedModuleSource.replace(/^\.\//v, "");
    const ownerRelativePaths = new Set(
        getReflectionSourcePaths(owner).map((ownerSourcePath) =>
            normalizeSourcePath(
                nodePath.resolve(
                    nodePath.dirname(ownerSourcePath),
                    normalizedModuleSource
                )
            )
        )
    );

    return getReflectionSourcePaths(candidate).some((candidateSourcePath) => {
        const normalizedCandidateSource =
            normalizeSourcePath(candidateSourcePath);

        return (
            normalizedCandidateSource === normalizedModuleSource ||
            normalizedCandidateSource.endsWith(`/${suffixModuleSource}`) ||
            setHas(ownerRelativePaths, normalizedCandidateSource)
        );
    });
}

/**
 * Normalize TypeDoc and platform-native source paths for comparison.
 *
 * @param sourcePath - Source path to normalize.
 *
 * @returns Slash-normalized path with platform-appropriate case handling.
 */
function normalizeSourcePath(sourcePath: string): string {
    const normalized = sourcePath.replaceAll("\\", "/");

    return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

/**
 * Parse the path and exported symbol from an authoring-style inline link.
 *
 * @param inlineTagText - Original inline-tag payload.
 *
 * @returns Parsed link fields, or undefined for an incomplete reference.
 */
function parsePathLink(inlineTagText: string): ParsedPathLink | undefined {
    const pipeIndex = inlineTagText.indexOf("|");
    const referenceText = (
        pipeIndex === -1 ? inlineTagText : inlineTagText.slice(0, pipeIndex)
    ).trim();
    const hashIndex = referenceText.indexOf("#");

    if (hashIndex <= 0 || hashIndex === referenceText.length - 1) {
        return undefined;
    }

    return {
        label:
            pipeIndex === -1 ? "" : inlineTagText.slice(pipeIndex + 1).trim(),
        moduleSource: referenceText.slice(0, hashIndex),
        symbolName: referenceText.slice(hashIndex + 1),
    };
}

/**
 * Resolve a parsed file-oriented link to one unambiguous reflection.
 *
 * @param parsedLink - Parsed path, symbol, and optional label.
 * @param owner - Reflection which owns the link.
 * @param reflectionTargetsByName - Source-backed reflections keyed by name.
 *
 * @returns A concrete target, or undefined when resolution is ambiguous.
 */
function resolvePathLinkTarget(
    parsedLink: Readonly<ParsedPathLink>,
    owner: Readonly<Reflection>,
    reflectionTargetsByName: ReadonlyMap<string, readonly Reflection[]>
): Reflection | undefined {
    const matchingPath = (
        reflectionTargetsByName.get(parsedLink.symbolName) ?? []
    ).filter((candidate) =>
        isReflectionDeclaredByModuleSource(
            candidate,
            owner,
            parsedLink.moduleSource
        )
    );
    const exportedTargets = matchingPath.filter((candidate) =>
        candidate.kindOf(ReflectionKind.SomeExport)
    );
    const preferredTargets = isEmpty(exportedTargets)
        ? matchingPath
        : exportedTargets;

    return preferredTargets.length === 1
        ? arrayFirst(preferredTargets)
        : undefined;
}
