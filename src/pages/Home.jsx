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

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(9); // Show 9 initially

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  // Load more courses (increments by 9)
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  // Show less (resets to 9)
  const handleShowLess = () => {
    setVisibleCount(9);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100">
      {/* Hero Section */}
      <div
        className="relative text-white py-16 text-center shadow-md bg-cover bg-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/free-vector/water-pollution-background-vector-with-droplet-border_53876-114050.jpg?w=1380')`,
        }}
      >
        {/* Overlay Effect */}
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

      {coursesStatus === "loading" ? (
        <p className="text-center text-gray-600 mt-5">Loading courses...</p>
      ) : coursesStatus === "failed" ? (
        <p className="text-center text-red-500 mt-5">{error}</p>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-10">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No courses found.
            </p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
                {filteredCourses.slice(0, visibleCount).map((course) => {
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

              {/* Show More / Show Less Buttons */}
              <div className="text-center mt-8">
                {visibleCount < filteredCourses.length && (
                  <button
                    onClick={handleShowMore}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition mx-2"
                  >
                    Show More
                  </button>
                )}
                {visibleCount > 9 && (
                  <button
                    onClick={handleShowLess}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition mx-2"
                  >
                    Show Less
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
