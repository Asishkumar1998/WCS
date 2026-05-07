"use client";

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export type RichTextEditorHandle = {
  getContent: () => string;
  clear: () => void;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: "#custom-toolbar", // 👈 use only this
          },
        },
        placeholder: "Write something...",
      });
    }

    return () => {
      quillRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getContent: () => quillRef.current?.root.innerHTML || "",
    clear: () => {
      if (quillRef.current) {
        quillRef.current.setText("");
      }
    },
  }));

  return (
    <div style={{ width: "100%" }}>
      {/* ✅ Your single toolbar */}
      <div id="custom-toolbar">
        <select className="ql-font" />
        <select className="ql-size" />
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <select className="ql-color" />
        <select className="ql-background" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <select className="ql-align" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
        <button className="ql-blockquote" />
        <button className="ql-code-block" />
        <button className="ql-clean" />
      </div>

      {/* ✅ Editor */}
      <div
        ref={editorRef}
        style={{ height: "170px", border: "1px solid #ccc", borderRadius: 6 }}
      />
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
