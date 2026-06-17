import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import * as nodePath from "node:path";
import { describe, expect, it } from "vitest";

import {
    convertHashLinksToBangLinksInComment,
    convertHashLinksToBangLinksInInlineTagText,
    convertHashLinksToBangLinksInParts,
} from "../hash-link-references-core.mjs";

const packageName = "typedoc-plugin-hash-link-references";
const fixtureDirectory = nodePath.join(".cache", "typedoc-fixture");
const typedocCliPath = nodePath.join(
    "node_modules",
    "typedoc",
    "bin",
    "typedoc"
);
const rootPluginLink = nodePath.join("node_modules", packageName);

describe("typedoc-plugin-hash-link-references", () => {
    it("rewrites repo-style hash links to TypeDoc declaration references", () => {
        expect.assertions(7);

        expect(
            convertHashLinksToBangLinksInInlineTagText("src/preset#config")
        ).toBe("src/preset!config");
        expect(
            convertHashLinksToBangLinksInInlineTagText(
                " src/preset#config | config export"
            )
        ).toBe(" src/preset!config | config export");
        expect(
            convertHashLinksToBangLinksInInlineTagText(
                "https://example.com/page#section"
            )
        ).toBe("https://example.com/page#section");
        expect(convertHashLinksToBangLinksInInlineTagText("Class#member")).toBe(
            "Class#member"
        );
        expect(
            convertHashLinksToBangLinksInInlineTagText("node:fs#readFile")
        ).toBe("node:fs!readFile");
        expect(
            convertHashLinksToBangLinksInInlineTagText(
                String.raw`C:\src\file#symbol`
            )
        ).toBe(String.raw`C:\src\file!symbol`);
        expect(
            convertHashLinksToBangLinksInInlineTagText("mailto:name#anchor")
        ).toBe("mailto:name#anchor");
    });

    it("mutates TypeDoc comment display parts in-place", () => {
        expect.assertions(3);

        const parts = [
            {
                kind: "inline-tag",
                tag: "@link",
                target: "stale",
                text: "src/preset#config",
                tsLinkText: "stale",
            },
            {
                kind: "inline-tag",
                tag: "@linkcode",
                text: "Class#member",
            },
        ];
        const comment = {
            blockTags: [
                {
                    content: parts,
                },
            ],
            summary: [],
        };

        convertHashLinksToBangLinksInComment(
            comment as unknown as Parameters<
                typeof convertHashLinksToBangLinksInComment
            >[0]
        );
        convertHashLinksToBangLinksInParts(
            parts as Parameters<typeof convertHashLinksToBangLinksInParts>[0]
        );

        expect(parts[0]?.text).toBe("src/preset!config");
        expect(parts[0]).not.toHaveProperty("target");
        expect(parts[1]?.text).toBe("Class#member");
    });

    it("loads in a real TypeDoc run from a consumer-style fixture", async () => {
        expect.assertions(2);

        await rm(fixtureDirectory, {
            force: true,
            recursive: true,
        });
        await mkdir(nodePath.join(fixtureDirectory, "src"), {
            recursive: true,
        });
        await mkdir(nodePath.join(fixtureDirectory, "node_modules"), {
            recursive: true,
        });
        await symlink(
            process.cwd(),
            nodePath.join(fixtureDirectory, "node_modules", packageName),
            "junction"
        );
        await symlink(
            nodePath.resolve("node_modules", "typedoc"),
            nodePath.join(fixtureDirectory, "node_modules", "typedoc"),
            "junction"
        );
        await rm(rootPluginLink, {
            force: true,
            recursive: true,
        });
        await symlink(process.cwd(), rootPluginLink, "junction");

        try {
            await Promise.all([
                writeFile(
                    nodePath.join(fixtureDirectory, "package.json"),
                    `${JSON.stringify({ name: "fixture", version: "1.0.0" }, null, 4)}\n`
                ),
                writeFile(
                    nodePath.join(fixtureDirectory, "src", "index.ts"),
                    [
                        "/** Uses {@link src/index#target | target}. */",
                        "export function source(): void {}",
                        "/** Target function. */",
                        "export function target(): void {}",
                        "",
                    ].join("\n")
                ),
                writeFile(
                    nodePath.join(fixtureDirectory, "tsconfig.json"),
                    `${JSON.stringify(
                        {
                            compilerOptions: {
                                module: "ESNext",
                                moduleResolution: "bundler",
                                skipLibCheck: true,
                                strict: true,
                                target: "ES2024",
                            },
                            include: ["src/**/*.ts"],
                        },
                        null,
                        4
                    )}\n`
                ),
                writeFile(
                    nodePath.join(fixtureDirectory, "typedoc.json"),
                    `${JSON.stringify(
                        {
                            entryPoints: ["src/index.ts"],
                            out: "api",
                            plugin: [packageName],
                            readme: "none",
                            tsconfig: "tsconfig.json",
                        },
                        null,
                        4
                    )}\n`
                ),
            ]);

            const output = execFileSync(
                process.execPath,
                [
                    typedocCliPath,
                    "--options",
                    "typedoc.json",
                ],
                {
                    cwd: fixtureDirectory,
                    encoding: "utf8",
                }
            );
            const indexHtml = await readFile(
                nodePath.join(
                    fixtureDirectory,
                    "api",
                    "functions",
                    "source.html"
                ),
                "utf8"
            );

            expect(output).toContain("html generated");
            expect(indexHtml).toContain("target");
        } finally {
            await rm(fixtureDirectory, {
                force: true,
                recursive: true,
            });
            await rm(rootPluginLink, {
                force: true,
                recursive: true,
            });
        }
    });
});
