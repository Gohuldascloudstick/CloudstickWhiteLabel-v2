import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { decodeContent, getEditorLanguage } from "../../utils/editor";
import { saveFileChange } from "../../redux/slice/FileManagerSlice";
import { useAppDispatch } from "../../redux/hook";
import type { FileManagerItem } from "../../utils/interfaces";
import { addToast } from "@heroui/react";

export default function FileEditorComponent({ file, onDirtyChange, theme, autoSave }: {
    file: FileManagerItem,
    onDirtyChange: (isDirty: boolean) => void,
    theme: string,
    autoSave: boolean
}) {
    const editorRef = useRef<any>(null);
    const [value, setValue] = useState("");
    const [dirty, setDirty] = useState(false);
    
    const isMobileView = () => typeof window !== "undefined" && window.innerWidth < 1024;
    const dispatch = useAppDispatch();

    // Load content when file changes
    useEffect(() => {
        if (file?.content !== undefined) {
            const decoded = decodeContent(file.content || "");
            setValue(decoded);
            setDirty(false);
            onDirtyChange(false);
        }
    }, [file.path, file.content]);

    function handleMount(editor: any, monaco: any) {
        editorRef.current = editor;

        // Ctrl / Cmd + S
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            () => handleSave()
        );
    }

    async function handleSave() {
        if (!editorRef.current) return;
        const content = editorRef.current.getValue();
        
        try {
            await dispatch(saveFileChange( {
                    path: file.path.substring(0, file.path.lastIndexOf("/")),
                    content,
                    name: file.name
            })).unwrap();
            
            onDirtyChange(false);
            setDirty(false);   addToast({ description: 'File saved successfully.', color: 'success' });
        } catch (error: any) {
            onDirtyChange(true);
            setDirty(true);
            addToast({ description: error || 'Failed to save file changes.', color: 'danger' });
        }
    }

    // Autosave logic
    useEffect(() => {
        // Only run if: 1. Content is dirty AND 2. (AutoSave is on OR it's mobile view)
        // Correcting the logic based on user's hint: !dirty || !isMobileView() ? !autoSave : false
        // Simplified: if dirty and (autoSave or mobile), then save.
        if (!dirty) return;
        
        const shouldAutoSave = isMobileView() || autoSave;
        if (!shouldAutoSave) return;

        const timer = setTimeout(() => {
            handleSave();
        }, 300);

        return () => clearTimeout(timer);
    }, [value, dirty, autoSave]);

    return (
        <div className="h-full w-full relative">
            <Editor
                height="100%"
                path={file.path}
                value={value}
                language={getEditorLanguage(file.name)}
                theme={theme}
                onMount={handleMount}
                onChange={(v) => {
                    const newValue = v ?? "";
                    setValue(newValue);
                    const isNowDirty = newValue !== decodeContent(file.content || "");
                    setDirty(isNowDirty);
                    onDirtyChange(isNowDirty);
                }}
                options={{
                    fontSize: 14,
                    wordWrap: "on",
                    minimap: { enabled: true },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 10 },
                    // Flexible check for write permission: if r-x but no w
                    readOnly: Boolean(file.permission && !file.permission.includes("w")),
                }}
            />
        </div>
    );
}
