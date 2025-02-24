const courseFormatter = (courseData) => {
  const cleanedCourses = courseData.map((course) => {
    const id = course._id;
    const title = course.title;
    const instructor = course.teacherId.name;
    return {
      id,
      title,
      instructor,
    };
  });
  return cleanedCourses;
};

export default courseFormatter;
