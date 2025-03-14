import React from "react";

const CourseMaterials = ({ files }) => {
  if (!files || files.length === 0) {
    return <p className="text-gray-500">No course materials uploaded yet.</p>;
  }

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Course Materials</h2>
      <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-gray-50">
        {files.map((file, index) => (
          <div key={index} className="flex flex-col items-center p-3 bg-white rounded-md shadow">
            {file.type === "image" ? (
              <img src={file.url} alt={file.name} className="w-24 h-24 object-cover rounded-md" />
            ) : file.type === "pdf" ? (
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                📄 {file.name}
              </a>
            ) : (
              <video controls className="w-24 h-16">
                <source src={file.url} type="video/mp4" />
              </video>
            )}
            <a href={file.url} target="_blank" download className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-700">
              Download
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseMaterials;
