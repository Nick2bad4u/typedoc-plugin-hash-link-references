#!/usr/bin/env node

/**
 * Read exactly one tarball filename from npm pack JSON metadata.
 *
 * Npm releases have emitted both an array of records and an object keyed by
 * package name. This helper accepts either shape while rejecting ambiguous or
 * incomplete output.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { arrayFirst } from "ts-extras";

/**
 * Check whether an unknown value is a non-null object record.
 *
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) => typeof value === "object" && value !== null;

/**
 * Parse npm pack metadata and return its only nonblank filename.
 *
 * @param {unknown} packMetadata
 *
 * @returns {string}
 *
 * @throws {TypeError} If the metadata shape or filename is invalid
 */
export const readNpmPackFilename = (packMetadata) => {
    const records = Array.isArray(packMetadata)
        ? packMetadata
        : isRecord(packMetadata)
          ? Object.values(packMetadata)
          : [];

    if (records.length !== 1) {
        throw new TypeError("Expected exactly one npm pack metadata record.");
    }

    const record = arrayFirst(records);
    if (!isRecord(record)) {
        throw new TypeError("Expected npm pack metadata to contain an object.");
    }

    const filename = record["filename"];
    if (typeof filename !== "string" || filename.trim().length === 0) {
        throw new TypeError(
            "Expected npm pack metadata to include a nonblank filename."
        );
    }

    return filename.trim();
};

const main = async () => {
    const [packMetadataPath, ...unexpectedArguments] = process.argv.slice(2);
    if (!packMetadataPath || unexpectedArguments.length > 0) {
        throw new TypeError(
            "Usage: node scripts/read-npm-pack-filename.mjs <npm-pack.json>"
        );
    }

    const packMetadata = JSON.parse(await readFile(packMetadataPath, "utf8"));
    process.stdout.write(readNpmPackFilename(packMetadata));
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        await main();
    } catch (error) {
        console.error("Failed to read npm pack metadata:", error);
        process.exitCode = 1;
    }
}
