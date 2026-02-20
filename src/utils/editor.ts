export function getEditorLanguage(filename?: string) {
  if (!filename) return "plaintext";

  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    /* ---------- Web Frontend ---------- */
    case "html":
    case "htm":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "sass":
      return "sass";
    case "less":
      return "less";

    case "js":
    case "mjs":
    case "cjs":
      return "javascript";
    case "jsx":
      return "javascript";

    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";

    case "json":
      return "json";
    case "jsonc":
      return "json";

    /* ---------- Markdown / Docs ---------- */
    case "md":
    case "mdx":
      return "markdown";

    /* ---------- Backend / Server ---------- */
    case "php":
      return "php";
    case "py":
      return "python";
    case "rb":
      return "ruby";
    case "java":
      return "java";
    case "kt":
      return "kotlin";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "cs":
      return "csharp";

    /* ---------- Shell / Scripts ---------- */
    case "sh":
    case "bash":
      return "shell";
    case "zsh":
      return "shell";
    case "ps1":
      return "powershell";

    /* ---------- Config / DevOps ---------- */
    case "yml":
    case "yaml":
      return "yaml";
    case "xml":
      return "xml";
    case "ini":
      return "ini";
    case "toml":
      return "toml";
    case "env":
      return "dotenv";

    /* ---------- Databases ---------- */
    case "sql":
      return "sql";
    case "graphql":
    case "gql":
      return "graphql";

    /* ---------- Docker / CI ---------- */
    case "dockerfile":
      return "dockerfile";

    /* ---------- Misc ---------- */
    case "txt":
      return "plaintext";

    default:
      return "plaintext";
  }
}

export function decodeContent(content: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = content;
  return textarea.value;
}
