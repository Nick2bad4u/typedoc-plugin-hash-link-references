// @ts-check

import { Converter } from "typedoc";

import { convertHashLinksToBangLinksInComment } from "./hash-link-references-core.mjs";

// TypeDoc's built-in LinkResolverPlugin runs at priority -300. This plugin must
// run before it, so its priority must be higher.
const RUN_BEFORE_LINK_RESOLVER_PRIORITY = 50;

/**
 * TypeDoc plugin entrypoint.
 *
 * @param {import("typedoc").Application} app
 *
 * @returns {void}
 */
export function load(app) {
    app.converter.on(
        Converter.EVENT_RESOLVE_END,
        (context) => {
            const { project } = context;
            const { reflections } = project;
            /** @type {Record<string, import("typedoc").Reflection>} */
            const reflectionMap = reflections;

            for (const reflectionId in reflectionMap) {
                if (Object.hasOwn(reflectionMap, reflectionId)) {
                    const reflection =
                        /** @type {import("typedoc").Reflection} */ (
                            reflectionMap[reflectionId]
                        );

                    if (reflection.comment) {
                        convertHashLinksToBangLinksInComment(
                            reflection.comment
                        );
                    }
                }
            }
        },
        RUN_BEFORE_LINK_RESOLVER_PRIORITY
    );
}
