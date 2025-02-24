import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, RefreshCcw } from "lucide-react";
import {useNavigate} from "react-router-dom";
import { uploadFiles } from "../api/CourseApis";

const FileUploader = ({
  existingFiles,
  onUpload,
  onDelete,
  onReplace,
  courseId,
}) => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      onUpload(acceptedFiles);
    },
  });

  const handleDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    onDelete(fileName);
  };

  const handleReplace = (oldFileName, newFile) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => (file.name === oldFileName ? newFile : file))
    );
    onReplace(oldFileName, newFile);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const res = await uploadFiles(courseId, formData);
    if (res === 201) navigate("/");
  };

  return (
    <div className="p-4 border border-dashed border-gray-400 rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Upload Course Files
      </h1>
      <div
        {...getRootProps()}
        className="p-6 border border-gray-300 rounded-md text-center cursor-pointer hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select</p>
      </div>

      {/* New File Previews */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">New Uploads</h3>
          <ul>
            {files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => handleDelete(file.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Existing Files */}
      {existingFiles?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Previously Uploaded Files</h3>
          <ul>
            {existingFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{file.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                  <label className="cursor-pointer text-blue-500 hover:text-blue-700">
                    <RefreshCcw size={18} />
                    <input
                      type="file"
                      hidden
                      accept="image/*,video/*,application/pdf"
                      onChange={(e) =>
                        handleReplace(file.name, e.target.files[0])
                      }
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-4">
        <button
          onClick={handleFileUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
