import { useState } from "react";
import ace from "ace-builds/src-noconflict/ace";
// import "ace-code/styles/ace.css";
// import "ace-code/styles/theme/cloud_editor.css";
// import "ace-code/styles/theme/cloud_editor_dark.css";

ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict");

// Import components
import typescriptHighlight from "@cloudscape-design/code-view/highlight/typescript";
import CodeView from "@cloudscape-design/code-view/code-view";
import CodeEditor from "@cloudscape-design/components/code-editor";

// Import types
import type { CodeEditorProps } from "@cloudscape-design/components/code-editor";

export type TEditorProps = {
  isEditable: boolean;
  code: string;
  onCodeChange(value: string): void;
};

/**
 * Hiển thị code editor
 * @param props
 * @returns
 */
export default function Editor(props: TEditorProps) {
  const [preferences, setPreferences] = useState<
    CodeEditorProps.Preferences | undefined
  >(undefined);

  if (props.isEditable)
    return (
      <CodeEditor
        ace={ace}
        language="json"
        value={props.code}
        preferences={preferences}
        loading={false}
        onPreferencesChange={(e) => setPreferences(e.detail)}
        onDelayedChange={(e) => props.onCodeChange(e.detail.value)}
        themes={{
          light: ["cloud_editor"],
          dark: ["cloud_editor_dark"],
        }}
        i18nStrings={{
          errorState: "Có lỗi xảy ra",
          loadingState: "Đang tải...",
          // thêm các chuỗi cần thiết khác
        }}
      />
    );

  return <CodeView lineNumbers content={props.code} />;
}
