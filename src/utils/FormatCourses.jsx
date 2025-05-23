const courseFormatter = (courseData) => {
  console.log(courseData);
  const cleanedCourses = courseData.map((course) => {
    const id = course._id;
    const title = course.title;
    const instructor = course.teacherId.name;
    const studentsEnrolled = course.studentsEnrolled.length;
    const duration = course.duration;
    const format = course.courseFormat;
    const profilePhoto = course.teacherId?.profilePhoto?.url;
    return {
      id,
      title,
      instructor,
      studentsEnrolled,
      profilePhoto,
      duration,
      format,
    };
  });
  return cleanedCourses;
};

export default courseFormatter;
