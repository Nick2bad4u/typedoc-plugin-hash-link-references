import type { Comment, CommentDisplayPart } from "typedoc";

/**
 * Mutates a TypeDoc comment in-place, rewriting repo-style `path#Symbol` links
 * into TypeDoc declaration references (`path!Symbol`).
 *
 * @param comment - Comment to update.
 */
export declare function convertHashLinksToBangLinksInComment(
    comment: Comment
): void;

/**
 * Rewrites `module#Export` to `module!Export` for module-source-like
 * references.
 *
 * @param inlineTagText - The inline-tag payload stored by TypeDoc.
 */
export declare function convertHashLinksToBangLinksInInlineTagText(
    inlineTagText: string
): string;

/**
 * Mutates TypeDoc display parts in-place.
 *
 * @param parts - Display parts collection whose inline-tag text may be
 *   rewritten.
 */
export declare function convertHashLinksToBangLinksInParts(
    parts: CommentDisplayPart[]
): void;
