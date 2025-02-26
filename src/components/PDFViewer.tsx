import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface FileItem {
  id: string;
  filename: string;
  mimetype: string;
  createdAt: string;
  updatedAt: string;
}

const FileViewer: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/v1/file`);
        console.log("📦 API Response:", data);
        if (Array.isArray(data)) {
          setFiles(data);
          if (data.length > 0) setSelectedFile(data[0]);
        } else {
          console.error("❌ Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const renderFilePreview = () => {
    if (!selectedFile) {
      return (
        <p className="text-gray-500 text-center mt-20">
          📄 Select a file to view
        </p>
      );
    }

    const fileUrl = `${BACKEND_URL}/api/v1/file/${selectedFile.id}`;
    const { mimetype } = selectedFile;

    if (mimetype === "application/pdf") {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[80vh] border rounded-lg"
          title={selectedFile.filename}
        />
      );
    } else if (mimetype.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt={selectedFile.filename}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />
      );
    } else {
      return (
        <p className="text-red-500 text-center mt-20">
          ⚠️ Preview not available for this file type.
        </p>
      );
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📂 Available Files</h2>
        <ul className="space-y-2 overflow-y-auto max-h-[80vh]">
          {files.map((file) => (
            <li
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`cursor-pointer p-2 rounded ${
                selectedFile?.id === file.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-blue-100"
              }`}
            >
              {file.filename}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-3 bg-white p-4 rounded-lg shadow">
        {renderFilePreview()}
      </div>
    </div>
  );
};

export default FileViewer;
