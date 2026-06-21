"use client";

import { FileCheck2, UploadCloud, X } from "lucide-react";
import { type DragEvent, useId, useRef, useState } from "react";

export interface UploadDropzoneProps {
  file?: File | null;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
}

export function UploadDropzone({
  file,
  onFileSelect,
  accept = ".pdf,.jpg,.jpeg,.png,.csv,.json",
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  label = "Drop evidence here",
  description = "Select a supported evidence file",
  error,
  className = "",
}: UploadDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  function select(nextFile?: File) {
    setDragging(false);
    if (!nextFile) return;
    if (nextFile.size > maxSize) {
      setLocalError(`File exceeds the ${(maxSize / 1024 / 1024).toFixed(0)} MB limit.`);
      return;
    }
    setLocalError("");
    onFileSelect(nextFile);
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) select(event.dataTransfer.files[0]);
  }

  const message = error || localError;
  return (
    <div className={className}>
      <div className="relative">
        <div
          onDragEnter={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={drop}
          className={`grid min-h-[260px] place-items-center border border-dashed px-6 py-8 text-center transition ${
            dragging ? "border-teal bg-teal/10" : "border-teal/45 bg-canvas hover:border-teal"
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          style={{ borderRadius: 8 }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={file ? `Replace ${file.name}` : label}
          aria-describedby={`${inputId}-description`}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(event) => { if (!disabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); inputRef.current?.click(); } }}
        >
          <div>
            <span className="mx-auto grid size-16 place-items-center rounded-full border border-cyan bg-teal/10 text-teal">
              {file ? <FileCheck2 className="size-7" /> : <UploadCloud className="size-7" />}
            </span>
            <p className="mt-5 break-all font-display text-lg font-bold text-ink">{file?.name || label}</p>
            <p id={`${inputId}-description`} className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              {file ? `${(file.size / 1024).toFixed(1)} KB selected` : description}
            </p>
            <span className="mt-5 inline-flex h-10 items-center rounded-md bg-forest px-5 text-xs font-semibold text-white">{file ? "Replace file" : "Choose file"}</span>
          </div>
        </div>
        {file ? (
          <button type="button" onClick={() => { setLocalError(""); onFileSelect(null); }} className="absolute right-3 top-3 grid size-9 place-items-center rounded-md text-muted hover:bg-white" aria-label={`Remove ${file.name}`}>
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      <input id={inputId} ref={inputRef} type="file" className="sr-only" accept={accept} disabled={disabled} onChange={(event) => select(event.target.files?.[0])} />
      {message ? <p className="mt-2 text-xs font-semibold text-coral" role="alert">{message}</p> : null}
    </div>
  );
}
