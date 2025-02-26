import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        BACKEND_URL + "/api/v1/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadStatus(
        `✅ File uploaded successfully: ${response.data.fileUrl}`
      );
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStatus(
        `❌ Upload failed: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Upload Invoice (PDF/Image)</h2>
      <input
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 mb-4"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Upload
      </button>
      {uploadStatus && <p className="mt-4 text-gray-700">{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
