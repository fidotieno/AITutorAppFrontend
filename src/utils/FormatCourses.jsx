const courseFormatter = (courseData) => {
  const cleanedCourses = courseData.map((course) => {
    const id = course._id;
    const title = course.title;
    const instructor = course.teacherId.name;
    const studentsEnrolled = course.studentsEnrolled.length;
    return {
      id,
      title,
      instructor,
      studentsEnrolled,
    };
  });
  return cleanedCourses;
};

export default courseFormatter;
