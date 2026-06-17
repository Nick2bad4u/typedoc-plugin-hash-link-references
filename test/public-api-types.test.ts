import type { Application, Comment, CommentDisplayPart } from "typedoc";

import { describe, expect, expectTypeOf, it } from "vitest";

import {
    convertHashLinksToBangLinksInComment,
    convertHashLinksToBangLinksInInlineTagText,
    convertHashLinksToBangLinksInParts,
} from "../src/core.js";
import { load } from "../src/plugin.js";

describe("public API types", () => {
    it("stays aligned with TypeDoc", () => {
        expect.assertions(1);

        expect(load).not.toBe(convertHashLinksToBangLinksInComment);

        expectTypeOf(load).parameter(0).toEqualTypeOf<Readonly<Application>>();
        expectTypeOf(load).returns.toBeVoid();

        expectTypeOf(convertHashLinksToBangLinksInComment)
            .parameter(0)
            .toEqualTypeOf<Readonly<Comment>>();
        expectTypeOf(convertHashLinksToBangLinksInComment).returns.toBeVoid();

        expectTypeOf(convertHashLinksToBangLinksInInlineTagText)
            .parameter(0)
            .toEqualTypeOf<string>();
        expectTypeOf(
            convertHashLinksToBangLinksInInlineTagText
        ).returns.toEqualTypeOf<string>();

        expectTypeOf(convertHashLinksToBangLinksInParts)
            .parameter(0)
            .toEqualTypeOf<readonly Readonly<CommentDisplayPart>[]>();
        expectTypeOf(convertHashLinksToBangLinksInParts).returns.toBeVoid();
    });
});
