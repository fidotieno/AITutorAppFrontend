import { getAllCourses } from "../api/CourseApis";

const courseLoader = async () => {
  const courses = await getAllCourses();
  return courses;
};

export default courseLoader;
