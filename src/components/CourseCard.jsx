import { Link } from "react-router-dom";

const CourseCard = ({ course, isEnrolled, onEnroll }) => {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-lg font-medium">{course.title}</h3>
      <p className="text-sm text-gray-600">Instructor: {course.instructor || course.teacherId.name}</p>
      {isEnrolled ? (
        <Link
          to={`/view-course/${course.id || course._id}`}
          className="text-blue-500 text-sm mt-2 block"
        >
          View Course
        </Link>
      ) : (
        <button
          onClick={() => onEnroll(course.id)}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 hover:cursor-pointer"
        >
          Enroll
        </button>
      )}
    </div>
  );
};

export default CourseCard;
