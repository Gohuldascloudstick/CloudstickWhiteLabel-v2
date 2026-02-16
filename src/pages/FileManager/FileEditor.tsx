import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { decodeContent, getEditorLanguage } from "../../../utils/editor";
import { saveFileChange } from "../../../redux/slice/FIlemanagerSlice";
import { useAppDispatch } from "../../../redux/hook";
import { FileManagerItem } from "../../../utils/interfaces";
import { addToast } from "@heroui/react";

export default function FileEditor({ file ,webid,serverid ,onDirtyChange ,theme ,autoSave}:{file:FileManagerItem,webid:string,serverid:string ,onDirtyChange: (isDirty: boolean) => void, theme: string,autoSave:boolean}) {
  const editorRef = useRef(null);
  const [value, setValue] = useState("");
  const [dirty, setDirty] = useState(false);
  const isMobileView = () => typeof window !== "undefined" && window.innerWidth < 1024;
  

  const dispatch = useAppDispatch()

  // Load content when file changes
  useEffect(() => {
    if (file?.content) {
      setValue(decodeContent(file.content));
      setDirty(false);
      onDirtyChange(false)
    }
  }, [file]);

  function handleMount(editor, monaco) {
    editorRef.current = editor;

    // Ctrl / Cmd + S
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => handleSave()
    );
  }

  async function handleSave() {
    const content = editorRef.current.getValue();
    console.log("Saving content for:", file.path);

    try {
      await dispatch(saveFileChange({webid, serverid , data :{path:file.path.substring(0, file.path.lastIndexOf("/")),content ,name:file.name}}))
  onDirtyChange(false)
      setDirty(false);
      
    } catch (error) {
      onDirtyChange(true)
      setDirty(true);
      addToast({description:'Failed to save file changes.',color:'danger'})
    }
    
    // Add your save logic here
  }

  useEffect(() => {
    // Only run if: 1. Content is dirty AND 2. We are on a mobile/tablet screen
    if (!dirty ||  !isMobileView() ? !autoSave : false) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 900); // 2 second delay for mobile

    return () => clearTimeout(timer);
  }, [value, dirty]);

useEffect(()=>{
  console.log(autoSave);
  
},[autoSave])

  

  return (
    <div className="h-full w-full relative">
      {/* {dirty && (
        <div className="absolute top-2 right-6 z-10 text-[10px] bg-blue-600 px-2 py-0.5 rounded-full">
          Unsaved Changes
        </div>
      )} */}
      <Editor
        height="100%"
        value={value}
    
        language={getEditorLanguage(file.name)}
        theme= {theme}
        onMount={handleMount}
        onChange={(v) => {
          setValue(v ?? "");
          if (v !== decodeContent(file.content)) setDirty(true); onDirtyChange(true) ;
        }}
        options={{
          fontSize: 14,
          wordWrap: "on",
          minimap: { enabled: true },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 10 },
          readOnly: !file.permission?.includes("w"), // Flexible check for write permission
        }}
      />
    </div>
  );
}