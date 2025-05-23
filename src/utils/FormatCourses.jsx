const courseFormatter = (courseData) => {
  const cleanedCourses = courseData.map((course) => {
    const id = course._id;
    const title = course.title;
    const instructor = course.teacherId.name;
    const studentsEnrolled = course.studentsEnrolled.length;
    const profilePhoto = course.teacherId?.profilePhoto?.url;
    return {
      id,
      title,
      instructor,
      studentsEnrolled,
      profilePhoto,
    };
  });
  return cleanedCourses;
};

export default courseFormatter;
