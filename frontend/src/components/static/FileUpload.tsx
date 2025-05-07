import React, { useRef, ChangeEvent, useState } from "react";

interface FileUploadProps {
  label: string;
  id: string;
  name: string;
  accept?: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  multiple?: boolean;
  helperText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  name,
  accept = "image/*",
  error,
  onChange,
  required = false,
  multiple = false,
  helperText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(multiple ? `${files.length} files selected` : files[0].name);
    } else {
      setFileName("");
    }
    onChange(e);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // const clearFileInput = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = '';
  //   }
  //   setFileName('');
  // };

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          required={required}
          multiple={multiple}
        />

        <button
          type="button"
          onClick={handleClick}
          className={`flex w-full items-center justify-between px-4 py-2 border ${
            error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
          } rounded-md text-left`}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            <span
              className={`${
                fileName ? "text-gray-900" : "text-gray-500"
              } truncate max-w-xs`}
            >
              {fileName || `Choose ${multiple ? "files" : "a file"}`}
            </span>
          </div>
          <span className="ml-3 text-sm font-medium text-[var(--primary-color)] bg-red-200 px-2 py-1 rounded-md">
            Browse
          </span>
        </button>
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;
