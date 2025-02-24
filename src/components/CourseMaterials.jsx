import React from "react";

const CourseMaterials = ({ files }) => {
  if (!files || files.length === 0) {
    return <p className="text-gray-500">No course materials uploaded yet.</p>;
  }

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Course Materials</h2>
      <ul className="border rounded-md p-4 bg-gray-50">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b py-2 last:border-none"
          >
            {/* File Preview */}
            {file.type === "image" ? (
              <img
                src={file.url.replace("dl=0", "raw=1")} // Ensures Dropbox images load properly
                alt={file.name}
                className="w-32 h-32 object-cover rounded-md"
              />
            ) : file.type === "pdf" ? (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                📄 {file.name}
              </a>
            ) : (
              <video controls className="w-32 h-20">
                <source src={file.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Download Button */}
            <a
              href={file.url}
              download
              className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CourseMaterials;
