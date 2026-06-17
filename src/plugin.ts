import { objectValues } from "ts-extras";
import { type Application, Converter } from "typedoc";

import { convertHashLinksToBangLinksInComment } from "./core.js";

// TypeDoc's built-in LinkResolverPlugin runs at priority -300. This plugin must
// run before it, so its priority must be higher.
const RUN_BEFORE_LINK_RESOLVER_PRIORITY = 50;

/**
 * TypeDoc plugin entrypoint.
 *
 * @param app - TypeDoc app instance.
 */
export function load(app: Application): void {
    app.converter.on(
        Converter.EVENT_RESOLVE_END,
        (context) => {
            for (const reflection of objectValues(
                context.project.reflections
            )) {
                if (reflection.comment) {
                    convertHashLinksToBangLinksInComment(reflection.comment);
                }
            }
        },
        RUN_BEFORE_LINK_RESOLVER_PRIORITY
    );
}
