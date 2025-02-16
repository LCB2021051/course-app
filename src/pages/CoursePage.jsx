import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "../redux/courseSlice";
import { createLike, removeLike } from "../redux/likesSlice";
import { db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import GetEnrolled from "../components/GetEnrolled";
import { FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa";

const CoursePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const auth = getAuth();

  // Redux State: course data & load status
  const { currentCourse, status, error } = useSelector(
    (state) => state.courses
  );

  // Local State
  const [userId, setUserId] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Track Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch the course & real-time course 'likes'
  useEffect(() => {
    dispatch(fetchCourse(id));

    // Real-time listener for the course's "likes" field
    const courseRef = doc(db, "courses", id);
    const unsubscribeLikes = onSnapshot(courseRef, (docSnap) => {
      if (docSnap.exists()) {
        setLikeCount(docSnap.data().likes || 0);
      }
    });

    return () => unsubscribeLikes();
  }, [id, dispatch]);

  // Real-time check if THIS user has liked the course
  useEffect(() => {
    if (!userId) {
      setHasLiked(false);
      return;
    }

    const likeDocRef = doc(db, "likes", `${userId}_${id}`);
    const unsubscribeUserLike = onSnapshot(likeDocRef, (docSnap) => {
      setHasLiked(docSnap.exists());
    });

    return () => unsubscribeUserLike();
  }, [id, userId]);

  const handleLike = () => {
    if (!userId) {
      alert("You must be logged in to like a course.");
      return;
    }
    if (hasLiked) {
      dispatch(removeLike({ userId, courseId: id }));
    } else {
      dispatch(createLike({ userId, courseId: id }));
    }
  };

  // Handle load states
  if (status === "loading")
    return (
      <p className="text-center text-gray-600 mt-5">
        Loading course details...
      </p>
    );

  if (status === "failed")
    return <p className="text-center text-red-500 mt-5">{error}</p>;

  if (!currentCourse)
    return (
      <p className="text-center text-gray-500 mt-5">No course data found!</p>
    );
  console.log(currentCourse.image);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="relative w-full h-64 bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={
            currentCourse.image ||
            "https://img.freepik.com/free-vector/water-pollution-background-vector-with-droplet-border_53876-114050.jpg?t=st=1739734898~exp=1739738498~hmac=851e5839f7bd7408410c3516e41de94454875b754dd8d826f3e9ba9bec97fe2d&w=1380"
          }
          alt="Course Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10 "></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-4xl font-bold">{currentCourse.name}</h1>
          <p className="text-lg mt-2">Instructor: {currentCourse.instructor}</p>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-8 mt-8">
        {/* Left Content (Course Details) */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Course Overview
          </h2>
          <p className="text-gray-700 mt-2">{currentCourse.description}</p>

          {/* Engagement Section */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition bg-blue-500 hover:bg-blue-600"
            >
              {hasLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}{" "}
              {likeCount}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100">
              <FaShareAlt /> Share
            </button>
          </div>

          {/* Syllabus Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Syllabus
            </h2>
            <div className="border border-gray-200 rounded-lg">
              {currentCourse.syllabus &&
                currentCourse.syllabus.map((week, idx) => (
                  <div key={idx} className="p-4 border-b last:border-none">
                    <p className="text-gray-700">
                      <strong>Week {week.week}:</strong> {week.topic}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Enrollment Card) */}
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800">Enroll Now</h3>
          <p className="text-gray-600 mt-2">
            Price:{" "}
            <span className="font-semibold text-green-600">
              ${currentCourse.fee}
            </span>
          </p>
          <div className="mt-4">
            <GetEnrolled courseId={id} amount={currentCourse.fee} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
