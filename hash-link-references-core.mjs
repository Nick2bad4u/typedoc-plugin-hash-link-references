// @ts-check

/**
 * @typedef {import("typedoc").Comment} Comment
 *
 * @typedef {import("typedoc").CommentDisplayPart} CommentDisplayPart
 */

/** @type {ReadonlySet<string>} */
const URL_LIKE_SCHEMES = new Set([
    "blob",
    "data",
    "file",
    "mailto",
    "tel",
    "urn",
]);

/** @type {ReadonlySet<string>} */
const INLINE_LINK_TAGS = new Set([
    "@link",
    "@linkcode",
    "@linkplain",
]);

/**
 * Mutates a TypeDoc comment in-place, rewriting repo-style `path#Symbol` links
 * into TypeDoc declaration references (`path!Symbol`).
 *
 * @param {Comment} comment
 *
 * @returns {void}
 */
export function convertHashLinksToBangLinksInComment(comment) {
    convertHashLinksToBangLinksInParts(comment.summary);
    for (const tag of comment.blockTags) {
        convertHashLinksToBangLinksInParts(tag.content);
    }
}

/**
 * Rewrites `module#Export` to `module!Export` for module-source-like
 * references. Whitespace and `| label` suffixes are preserved.
 *
 * @param {string} inlineTagText - The inline-tag payload stored by TypeDoc.
 *
 * @returns {string}
 */
export function convertHashLinksToBangLinksInInlineTagText(inlineTagText) {
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
 * @param {CommentDisplayPart[]} parts
 *
 * @returns {void}
 */
export function convertHashLinksToBangLinksInParts(parts) {
    for (const part of parts) {
        if (part.kind === "inline-tag" && INLINE_LINK_TAGS.has(part.tag)) {
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

/**
 * @param {string} moduleSource
 *
 * @returns {boolean}
 */
function isModuleSourceLike(moduleSource) {
    return (
        moduleSource.includes("/") ||
        moduleSource.includes("\\") ||
        moduleSource.startsWith("@") ||
        moduleSource.includes("-") ||
        moduleSource.includes(":")
    );
}

/**
 * @param {string} moduleSource
 *
 * @returns {boolean}
 */
function isUrlLike(moduleSource) {
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

    return URL_LIKE_SCHEMES.has(scheme.toLowerCase());
}
