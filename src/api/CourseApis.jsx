const getAllCourses = async () => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/courses/get-courses"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/courses/get-courses`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const courses = await res.json();
  return courses;
};

const getEnrolledCourses = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/courses/get-enrolled-courses"
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/courses/get-enrolled-courses`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  return data;
};

const enrollCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/courses/enroll-course"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/courses/enroll-course`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseId),
    }
  );
  return res.status;
};

const unenrollCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/courses/${courseId}/unenroll`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/courses/${courseId}/unenroll`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.status;
};

const removeStudentFromCourse = async (courseId, studentId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/courses/${courseId}/remove-student/${studentId}`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/courses/${courseId}/remove-student/${studentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.status;
};

const getCourse = async (courseId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/courses/get-course/${courseId}`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/courses/get-course/${courseId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const course = await res.json();
  return course.course;
};

const getCreatedCourses = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/courses/get-created-courses"
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/courses/get-created-courses`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  return data.teacherCourses;
};

const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/courses/create-course"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/courses/create-course`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    }
  );
  return res.status;
};

const editCourse = async (courseId, courseData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/courses/edit-course/${courseId}`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/courses/edit-course/${courseId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    }
  );
  return res.status;
};

const uploadFiles = async (courseId, formData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT == "development"
        ? `/api/api/courses/upload-files/${courseId}`
        : `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/courses/upload-files/${courseId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (response.ok) return response.status;
  } catch (error) {
    console.error("File upload error:", error);
  }
};

const deleteCourseFile = async (courseId, fileName) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT == "development"
        ? `/api/api/courses/${courseId}/delete-file/${fileName}`
        : `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/courses//${courseId}/delete-file/${fileName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) return response.status;
  } catch (error) {
    console.error("File deletion error:", error);
  }
};

const replaceCourseFile = async (courseId, fileName, formData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT == "development"
        ? `/api/api/courses/${courseId}/replace-file/${fileName}`
        : `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/courses//${courseId}/replace-file/${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (response.ok) return response.status;
  } catch (error) {
    console.error("File deletion error:", error);
  }
};

export {
  getAllCourses,
  getEnrolledCourses,
  enrollCourse,
  getCourse,
  getCreatedCourses,
  createCourse,
  editCourse,
  uploadFiles,
  deleteCourseFile,
  replaceCourseFile,
  unenrollCourse,
  removeStudentFromCourse,
};
