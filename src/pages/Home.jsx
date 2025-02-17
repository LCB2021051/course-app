import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourses } from "../redux/courseSlice";
import { Link } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();

  const {
    courses,
    status: coursesStatus,
    error,
  } = useSelector((state) => state.courses);

  console.log(courses);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  if (coursesStatus === "loading")
    return <p className="text-center text-gray-600 mt-5">Loading courses...</p>;

  if (coursesStatus === "failed")
    return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 text-center shadow-md bg-cover bg-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/water-pollution-background-vector-with-droplet-border_53876-114050.jpg?t=st=1739734898~exp=1739738498~hmac=851e5839f7bd7408410c3516e41de94454875b754dd8d826f3e9ba9bec97fe2d&w=1380')`,
        }}
      >
        {/* Overlay Effect for Better Readability */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4">
            Find Your Perfect Course
          </h1>
          <p className="text-lg opacity-90">
            Explore top-rated courses and boost your skills.
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white text-slate-800 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Course Listing */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No courses found.</p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {filteredCourses.map((course) => {
              const likeCount = course.likes || 0;
              const courseImage =
                course.image ||
                "https://img.freepik.com/premium-vector/electronic-smart-watch-app-tracker-smartphone-screen-quality-quantity-sleep-control-concept-horizontal-vector-illustration_48369-42678.jpg?w=1380";

              return (
                <div
                  key={course.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  {/* Course Image */}
                  <div className="relative">
                    <img
                      src={courseImage}
                      alt={course.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white text-gray-800 text-sm px-3 py-1 rounded-full shadow-md">
                      ❤️ {likeCount}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {course.name}
                    </h2>
                    <p className="text-gray-600 flex-grow">
                      {course.description}
                    </p>

                    {/* View Course Button */}
                    <div className="mt-4">
                      <Link
                        to={`/course/${course.id}`}
                        className="block text-center bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
