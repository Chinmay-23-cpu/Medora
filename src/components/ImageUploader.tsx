"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export function ImageUploader({
  onFile,
  preview,
}: {
  onFile: (dataUrl: string) => void;
  preview: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function readFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onFile(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files[0];
        if (file) readFile(file);
      }}
      className={`rounded-3xl border border-dashed p-4 transition ${
        drag ? "border-[var(--accent)] bg-[#ecf4f1]" : "border-[var(--line)] bg-[var(--card)]"
      }`}
    >
      {preview ? (
        <img
          src={preview}
          alt="Uploaded scan"
          className="mx-auto max-h-80 rounded-2xl object-contain"
        />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 py-14 text-[var(--muted)]"
        >
          <Upload />
          <span className="text-sm">Drop a chest, cardiac, or brain image, or browse files</span>
          <span className="text-xs">JPEG, PNG, or WebP. De-identify images before upload.</span>
        </button>
      )}
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-[var(--line)] px-4 py-1.5 text-sm"
        >
          {preview ? "Replace image" : "Choose file"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
        }}
      />
    </div>
  );
}
