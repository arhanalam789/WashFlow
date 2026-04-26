
"""
Remove comments from source files.

Examples:
  python3 script.py backend/src/routes/auth.ts --in-place
  python3 script.py frontend/src --extensions .js,.jsx,.ts,.tsx,.css --in-place
"""

from __future__ import annotations

import argparse
import io
import tokenize
from pathlib import Path


DEFAULT_EXTENSIONS = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".css",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
}


def strip_python_comments(text: str) -> str:
    buffer = io.StringIO(text)
    tokens = tokenize.generate_tokens(buffer.readline)
    cleaned: list[str] = []
    previous_end = (1, 0)

    for token_type, token_string, start, end, _ in tokens:
        if token_type == tokenize.COMMENT:
            previous_end = end
            continue

        start_line, start_col = start
        end_line, end_col = end
        prev_line, prev_col = previous_end

        if start_line > prev_line:
            cleaned.append("\n" * (start_line - prev_line))
            cleaned.append(" " * start_col)
        else:
            cleaned.append(" " * max(start_col - prev_col, 0))

        cleaned.append(token_string)
        previous_end = (end_line, end_col)

    return "".join(cleaned)


def strip_c_like_comments(text: str) -> str:
    result: list[str] = []
    i = 0
    length = len(text)
    in_single_line = False
    in_multi_line = False
    in_string = False
    string_char = ""
    escape = False

    while i < length:
        current = text[i]
        next_char = text[i + 1] if i + 1 < length else ""

        if in_single_line:
            if current == "\n":
                in_single_line = False
                result.append(current)
            i += 1
            continue

        if in_multi_line:
            if current == "*" and next_char == "/":
                in_multi_line = False
                i += 2
            else:
                if current == "\n":
                    result.append("\n")
                i += 1
            continue

        if in_string:
            result.append(current)
            if escape:
                escape = False
            elif current == "\\":
                escape = True
            elif current == string_char:
                in_string = False
            i += 1
            continue

        if current in {'"', "'", "`"}:
            in_string = True
            string_char = current
            result.append(current)
            i += 1
            continue

        if current == "/" and next_char == "/":
            in_single_line = True
            i += 2
            continue

        if current == "/" and next_char == "*":
            in_multi_line = True
            i += 2
            continue

        result.append(current)
        i += 1

    return "".join(result)


def strip_html_comments(text: str) -> str:
    result: list[str] = []
    i = 0
    length = len(text)

    while i < length:
        if text.startswith("<!--", i):
            end_index = text.find("-->", i + 4)
            if end_index == -1:
                break
            i = end_index + 3
            continue
        result.append(text[i])
        i += 1

    return "".join(result)


def strip_comments(path: Path, text: str) -> str:
    suffix = path.suffix.lower()

    if suffix == ".py":
        return strip_python_comments(text)

    if suffix in {".html", ".htm", ".xml"}:
        return strip_html_comments(text)

    return strip_c_like_comments(text)


def iter_code_files(path: Path, extensions: set[str]):
    if path.is_file():
        if path.suffix.lower() in extensions:
            yield path
        return

    for file_path in path.rglob("*"):
        if file_path.is_file() and file_path.suffix.lower() in extensions:
            yield file_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Strip comments from code files.")
    parser.add_argument("path", help="File or directory to process.")
    parser.add_argument(
        "--extensions",
        default=",".join(sorted(DEFAULT_EXTENSIONS)),
        help="Comma-separated extensions to process.",
    )
    parser.add_argument(
        "--in-place",
        action="store_true",
        help="Overwrite files instead of printing the cleaned output.",
    )
    args = parser.parse_args()

    target = Path(args.path).resolve()
    extensions = {
        extension.strip() if extension.startswith(".") else f".{extension.strip()}"
        for extension in args.extensions.split(",")
        if extension.strip()
    }

    processed = 0

    for file_path in iter_code_files(target, extensions):
        original = file_path.read_text(encoding="utf-8")
        cleaned = strip_comments(file_path, original)
        processed += 1

        if args.in_place:
            file_path.write_text(cleaned, encoding="utf-8")
        else:
            print(f"===== {file_path} =====")
            print(cleaned)

    if processed == 0:
        raise SystemExit("No matching code files were found.")


if __name__ == "__main__":
    main()
