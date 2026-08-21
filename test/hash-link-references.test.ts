import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import * as nodePath from "node:path";
import { Application, Converter } from "typedoc";
import { describe, expect, it, vi } from "vitest";

import {
    convertHashLinksToBangLinksInComment,
    convertHashLinksToBangLinksInInlineTagText,
    convertHashLinksToBangLinksInParts,
} from "../src/core.js";
import { load } from "../src/plugin.js";

const packageName = "typedoc-plugin-hash-link-references";
const fixtureDirectory = nodePath.join(".cache", "typedoc-fixture");
const programmaticFixtureDirectory = nodePath.join(
    ".cache",
    "typedoc-programmatic-fixture"
);
const typedocCliPath = nodePath.join(
    "node_modules",
    "typedoc",
    "bin",
    "typedoc"
);
const rootPluginLink = nodePath.join("node_modules", packageName);
const npmPackMetadataFixtureDirectory = nodePath.join(
    ".cache",
    "npm-pack-metadata"
);
const npmPackMetadataParserPath = nodePath.join(
    "scripts",
    "read-npm-pack-filename.mjs"
);

describe("typedoc-plugin-hash-link-references", () => {
    it("rewrites repo-style hash links to TypeDoc declaration references", () => {
        expect.assertions(9);

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
        expect(
            convertHashLinksToBangLinksInInlineTagText(
                "web+custom:resource#fragment"
            )
        ).toBe("web+custom:resource#fragment");
        expect(
            convertHashLinksToBangLinksInInlineTagText(
                "vscode:extension/example#setting"
            )
        ).toBe("vscode:extension/example#setting");
    });

    it("registers one listener per TypeDoc application", () => {
        expect.assertions(4);

        const firstOn = vi.fn<(...arguments_: unknown[]) => void>();
        const secondOn = vi.fn<(...arguments_: unknown[]) => void>();
        const firstApplication = {
            converter: { on: firstOn },
        } as unknown as Readonly<Application>;
        const secondApplication = {
            converter: { on: secondOn },
        } as unknown as Readonly<Application>;

        load(firstApplication);
        load(firstApplication);
        load(secondApplication);

        expect(firstOn).toHaveBeenCalledTimes(1);
        expect(secondOn).toHaveBeenCalledTimes(1);
        expect(firstOn).toHaveBeenCalledWith(
            Converter.EVENT_RESOLVE_END,
            expect.any(Function),
            50
        );
        expect(firstOn.mock.calls[0]?.[1]).not.toBe(
            secondOn.mock.calls[0]?.[1]
        );
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

    it("parses supported npm pack metadata shapes strictly", async () => {
        expect.assertions(4);

        await rm(npmPackMetadataFixtureDirectory, {
            force: true,
            recursive: true,
        });
        await mkdir(npmPackMetadataFixtureDirectory, { recursive: true });

        const arrayMetadataPath = nodePath.join(
            npmPackMetadataFixtureDirectory,
            "array.json"
        );
        const objectMetadataPath = nodePath.join(
            npmPackMetadataFixtureDirectory,
            "object.json"
        );
        const multipleMetadataPath = nodePath.join(
            npmPackMetadataFixtureDirectory,
            "multiple.json"
        );
        const blankMetadataPath = nodePath.join(
            npmPackMetadataFixtureDirectory,
            "blank.json"
        );

        try {
            await Promise.all([
                writeFile(
                    arrayMetadataPath,
                    JSON.stringify([{ filename: "candidate.tgz" }])
                ),
                writeFile(
                    objectMetadataPath,
                    JSON.stringify({
                        [packageName]: { filename: "candidate.tgz" },
                    })
                ),
                writeFile(
                    multipleMetadataPath,
                    JSON.stringify([
                        { filename: "first.tgz" },
                        { filename: "second.tgz" },
                    ])
                ),
                writeFile(
                    blankMetadataPath,
                    JSON.stringify([{ filename: " " }])
                ),
            ]);

            const parseMetadata = (metadataPath: string) =>
                execFileSync(
                    process.execPath,
                    [npmPackMetadataParserPath, metadataPath],
                    {
                        encoding: "utf8",
                        stdio: [
                            "ignore",
                            "pipe",
                            "pipe",
                        ],
                    }
                );

            expect(parseMetadata(arrayMetadataPath)).toBe("candidate.tgz");
            expect(parseMetadata(objectMetadataPath)).toBe("candidate.tgz");
            expect(() => parseMetadata(multipleMetadataPath)).toThrow(
                /Expected exactly one npm pack metadata record/v
            );
            expect(() => parseMetadata(blankMetadataPath)).toThrow(
                /nonblank filename/v
            );
        } finally {
            await rm(npmPackMetadataFixtureDirectory, {
                force: true,
                recursive: true,
            });
        }
    });

    it("resolves source paths across repeated real TypeDoc conversions", async () => {
        expect.assertions(4);

        await rm(programmaticFixtureDirectory, {
            force: true,
            recursive: true,
        });
        await mkdir(nodePath.join(programmaticFixtureDirectory, "src"), {
            recursive: true,
        });

        const entryPointPath = nodePath
            .resolve(programmaticFixtureDirectory, "src", "index.ts")
            .replaceAll("\\", "/");
        const tsconfigPath = nodePath
            .resolve(programmaticFixtureDirectory, "tsconfig.json")
            .replaceAll("\\", "/");

        try {
            await Promise.all([
                writeFile(
                    nodePath.join(programmaticFixtureDirectory, "package.json"),
                    `${JSON.stringify({ name: "programmatic-fixture", version: "1.0.0" }, null, 4)}\n`
                ),
                writeFile(
                    entryPointPath,
                    [
                        "/** Uses {@link src/index.ts#target | root target}. */",
                        "export function sourceRoot(): void {}",
                        "/** Uses {@link ../src/index.ts#target | relative target}. */",
                        "export function sourceRelative(): void {}",
                        "/** Target function. */",
                        "export function target(): void {}",
                        "",
                    ].join("\n")
                ),
                writeFile(
                    tsconfigPath,
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
            ]);

            const app = await Application.bootstrap({
                entryPoints: [entryPointPath],
                plugin: [],
                readme: "none",
                tsconfig: tsconfigPath,
                validation: {
                    invalidLink: true,
                },
            });
            load(app);

            for (const outputName of ["api-first", "api-second"] as const) {
                const project = await app.convert();
                if (!project) {
                    throw new TypeError(
                        "TypeDoc conversion returned no project."
                    );
                }

                const outputDirectory = nodePath.join(
                    programmaticFixtureDirectory,
                    outputName
                );
                await app.generateDocs(project, outputDirectory);

                const rootSourceHtml = await readFile(
                    nodePath.join(
                        outputDirectory,
                        "functions",
                        "sourceRoot.html"
                    ),
                    "utf8"
                );
                const relativeSourceHtml = await readFile(
                    nodePath.join(
                        outputDirectory,
                        "functions",
                        "sourceRelative.html"
                    ),
                    "utf8"
                );

                expect(rootSourceHtml).toMatch(
                    /href="target\.html"[^>]*>root target<\/a>/v
                );
                expect(relativeSourceHtml).toMatch(
                    /href="target\.html"[^>]*>relative target<\/a>/v
                );
            }
        } finally {
            await rm(programmaticFixtureDirectory, {
                force: true,
                recursive: true,
            });
        }
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
                        "/** Uses {@link src/index.ts#target | target}. */",
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
                            validation: {
                                invalidLink: false,
                            },
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
            expect(indexHtml).toMatch(/href="target\.html"/v);
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
