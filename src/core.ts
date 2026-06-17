import type { Comment, CommentDisplayPart } from "typedoc";

import { setHas } from "ts-extras";

const URL_LIKE_SCHEMES: ReadonlySet<string> = new Set([
    "blob",
    "data",
    "file",
    "mailto",
    "tel",
    "urn",
]);

const INLINE_LINK_TAGS: ReadonlySet<`@${string}`> = new Set([
    "@link",
    "@linkcode",
    "@linkplain",
]);

/**
 * Mutates a TypeDoc comment in-place, rewriting repo-style `path#Symbol` links
 * into TypeDoc declaration references (`path!Symbol`).
 *
 * @param comment - Comment to update.
 */
export function convertHashLinksToBangLinksInComment(comment: Comment): void {
    convertHashLinksToBangLinksInParts(comment.summary);
    for (const tag of comment.blockTags) {
        convertHashLinksToBangLinksInParts(tag.content);
    }
}

/**
 * Rewrites `module#Export` to `module!Export` for module-source-like
 * references. Whitespace and `| label` suffixes are preserved.
 *
 * @param inlineTagText - The inline-tag payload stored by TypeDoc.
 */
export function convertHashLinksToBangLinksInInlineTagText(
    inlineTagText: string
): string {
    const pipeIndex = inlineTagText.indexOf("|");
    const beforePipe =
        pipeIndex === -1 ? inlineTagText : inlineTagText.slice(0, pipeIndex);

    const trimmedStart = beforePipe.trimStart();
    const leadingWhitespace = beforePipe.slice(
        0,
        beforePipe.length - trimmedStart.length
    );

    const trimmedEnd = beforePipe.trimEnd();
    const trailingWhitespace = beforePipe.slice(trimmedEnd.length);

    const trimmed = beforePipe.slice(
        leadingWhitespace.length,
        beforePipe.length - trailingWhitespace.length
    );

    const hashIndex = trimmed.indexOf("#");
    if (hashIndex === -1) {
        return inlineTagText;
    }

    const moduleSource = trimmed.slice(0, hashIndex);
    if (isUrlLike(moduleSource) || !isModuleSourceLike(moduleSource)) {
        return inlineTagText;
    }

    const afterHash = trimmed.slice(hashIndex + 1);
    if (!afterHash) {
        return inlineTagText;
    }

    const rewrittenCore = `${moduleSource}!${afterHash}`;
    const rebuiltBeforePipe = `${leadingWhitespace}${rewrittenCore}${trailingWhitespace}`;

    return pipeIndex === -1
        ? rebuiltBeforePipe
        : `${rebuiltBeforePipe}${inlineTagText.slice(pipeIndex)}`;
}

/**
 * Mutates TypeDoc display parts in-place.
 *
 * @param parts - Display parts collection whose inline-tag text may be
 *   rewritten.
 */
export function convertHashLinksToBangLinksInParts(
    parts: CommentDisplayPart[]
): void {
    for (const part of parts) {
        if (part.kind === "inline-tag" && setHas(INLINE_LINK_TAGS, part.tag)) {
            const rewritten = convertHashLinksToBangLinksInInlineTagText(
                part.text
            );

            if (rewritten !== part.text) {
                part.text = rewritten;
                delete part.target;
                delete part.tsLinkText;
            }
        }
    }
}

function isModuleSourceLike(moduleSource: string): boolean {
    return (
        moduleSource.includes("/") ||
        moduleSource.includes("\\") ||
        moduleSource.startsWith("@") ||
        moduleSource.includes("-") ||
        moduleSource.includes(":")
    );
}

function isUrlLike(moduleSource: string): boolean {
    if (moduleSource.includes("://")) {
        return true;
    }

    const firstColon = moduleSource.indexOf(":");
    if (firstColon <= 0) {
        return false;
    }

    const scheme = moduleSource.slice(0, firstColon);
    if (
        /^[A-Za-z]$/v.test(scheme) &&
        (moduleSource.slice(firstColon + 1).includes("/") ||
            moduleSource.slice(firstColon + 1).includes("\\"))
    ) {
        return false;
    }

    return setHas(URL_LIKE_SCHEMES, scheme.toLowerCase());
}
