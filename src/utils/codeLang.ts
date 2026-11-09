/*
 * OrangeJudge, a competitive programming platform
 *
 * Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 */

import type {Extension} from "@codemirror/state";
import {default_lang} from "@/utils/constants";

/** CodeMirror language modes the editor knows about. */
export type EditorMode = "cpp" | "python" | "java" | "rust" | "go" | "javascript" | "typescript";

/** Minimal shape of a judge language (see the judgeInfo store). */
export interface LangLike {
    name: string;
    ext: string;
    ext_default?: boolean;
}

const ext_modes: { [ext: string]: EditorMode } = {
    ".c": "cpp", ".h": "cpp", ".cpp": "cpp", ".cc": "cpp", ".cxx": "cpp", ".hpp": "cpp", ".hh": "cpp",
    ".py": "python", ".pyw": "python",
    ".java": "java",
    ".rs": "rust",
    ".go": "go",
    ".js": "javascript", ".mjs": "javascript", ".cjs": "javascript",
    ".ts": "typescript",
};

/** Matched against judge language names such as "C++17", "C99", "Python3.10.12", "PyPy3.10", "Java8". */
const name_modes: [RegExp, EditorMode][] = [
    [/^(c\+\+|cpp|g\+\+|clang)/i, "cpp"],
    [/^c(\d+|$)/i, "cpp"],
    [/^(python|pypy|py\d)/i, "python"],
    [/^(javascript|node|js)/i, "javascript"],
    [/^(typescript|ts)/i, "typescript"],
    [/^java(?!script)/i, "java"],
    [/^rust/i, "rust"],
    [/^go(lang)?(\d|$)/i, "go"],
];

const loaders: { [mode in EditorMode]: () => Promise<Extension> } = {
    cpp: async () => (await import("@codemirror/lang-cpp")).cpp(),
    python: async () => (await import("@codemirror/lang-python")).python(),
    java: async () => (await import("@codemirror/lang-java")).java(),
    rust: async () => (await import("@codemirror/lang-rust")).rust(),
    go: async () => (await import("@codemirror/lang-go")).go(),
    javascript: async () => (await import("@codemirror/lang-javascript")).javascript(),
    typescript: async () => (await import("@codemirror/lang-javascript")).javascript({typescript: true}),
};
const cache: { [mode: string]: Promise<Extension> } = {};

/** The lowercase extension of a filename including the dot, or "" if there is none. */
export function fileExt(filename: string): string {
    const i = filename.lastIndexOf(".");
    return i <= 0 ? "" : filename.slice(i).toLowerCase();
}

/**
 * Decide the editor mode from a judge language name, falling back to a file extension
 * (the language's source extension or the edited file's name). Returns null for plain text.
 */
export function detectMode(lang_name?: string | null, ext?: string | null): EditorMode | null {
    if (lang_name) {
        if (/^(plain)?text/i.test(lang_name)) return null;
        for (const [re, mode] of name_modes) {
            if (re.test(lang_name)) return mode;
        }
    }
    if (ext) return ext_modes[ext.toLowerCase()] ?? null;
    return null;
}

/** Load (once) the CodeMirror language extension for a mode; [] for plain text. */
export function loadMode(mode: EditorMode | null): Promise<Extension> {
    if (mode === null) return Promise.resolve([]);
    if (!(mode in cache)) {
        cache[mode] = loaders[mode]().catch(err => {
            delete cache[mode];
            throw err;
        });
    }
    return cache[mode];
}

/**
 * The judge language a file with this name should start with. Mirrors the backend's
 * executing.lang_for_filename: the language marked ext_default wins, then the site default,
 * then any language with that extension.
 */
export function langForFilename(filename: string, langs: LangLike[], allowed?: string[]): string | null {
    const ext = fileExt(filename);
    const usable = langs.filter(o => !allowed || allowed.includes(o.name));
    const matched = ext ? usable.filter(o => o.ext.toLowerCase() === ext) : [];
    if (matched.length === 0) return null;
    return (matched.find(o => o.ext_default) ?? matched.find(o => o.name === default_lang) ?? matched[0]).name;
}

/** Source extension of a judge language, if known. */
export function langExt(lang_name: string, langs: LangLike[]): string | null {
    return langs.find(o => o.name === lang_name)?.ext ?? null;
}
