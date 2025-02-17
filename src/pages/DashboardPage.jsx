import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [user] = useAuthState(auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses(user.uid);
    }
  }, [user]);

  const fetchEnrolledCourses = async (userId) => {
    try {
      const enrolmentsQuery = query(
        collection(db, "enrolments"),
        where("studentId", "==", userId)
      );
      const enrolmentsSnapshot = await getDocs(enrolmentsQuery);

      const coursesData = await Promise.all(
        enrolmentsSnapshot.docs.map(async (enrolmentDoc) => {
          const { courseId, progress = 0 } = enrolmentDoc.data(); // Get progress from enrolments
          if (!courseId) return null;

          const courseRef = doc(db, "courses", courseId);
          const courseSnap = await getDoc(courseRef);
          if (!courseSnap.exists()) return null;

          return { id: courseId, ...courseSnap.data(), progress }; // Merge progress
        })
      );

      setEnrolledCourses(coursesData.filter(Boolean));
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">
          Please log in to access the dashboard.
        </p>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
      {/* Sticky Page Heading */}
      <div
        className="relative text-white py-30 text-center shadow-md bg-cover bg-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/water-pollution-background-vector-with-droplet-border_53876-114050.jpg?w=1380')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative z-10 text-4xl font-extrabold text-white text-center">
          My Enrolled Courses
        </h1>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-10">
        {enrolledCourses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {enrolledCourses.map((course) => {
              const likeCount = course.likes || 0;
              const courseImage =
                course.image ||
                "https://img.freepik.com/premium-vector/electronic-smart-watch-app-tracker-smartphone-screen-quality-quantity-sleep-control-concept-horizontal-vector-illustration_48369-42678.jpg?w=1380";

              return (
                <Link
                  to={`/course/${course.id}`}
                  key={course.id}
                  className="group block"
                >
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-2xl">
                    <div className="flex flex-col md:flex-row">
                      {/* Course Image */}
                      <div className="md:w-1/3 w-full overflow-hidden">
                        <img
                          src={courseImage}
                          alt={course.name}
                          className="w-full h-56 object-cover object-center group-hover:brightness-90"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="p-6 flex flex-col justify-between w-full min-h-[200px]">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-500 transition">
                            {course.name}
                          </h2>
                          <p className="text-gray-600 mb-3 group-hover:text-gray-800 transition">
                            {course.description}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="relative h-3 w-full bg-gray-200 rounded-full">
                            <div
                              className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                                course.progress === 100
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            {course.progress}% Completed
                          </p>
                        </div>

                        {/* Likes & Enrolled Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <svg
                              className="w-5 h-5 text-red-500 transition group-hover:scale-110"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{likeCount} Likes</span>
                          </div>

                          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                            Enrolled
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
