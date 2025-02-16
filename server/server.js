require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

const sampleCourses = [
  {
    name: "React Basics",
    instructor: "John Doe",
    description:
      "Learn React.js fundamentals and build modern web applications.",
    enrollmentStatus: "Open",
    duration: "6 weeks",
    syllabus: [
      { week: 1, topic: "JSX & Components" },
      { week: 2, topic: "Props and State Management" },
      { week: 3, topic: "React Hooks (useState, useEffect)" },
      { week: 4, topic: "React Router and Navigation" },
    ],
    likes: 10,
  },
  {
    name: "JavaScript Fundamentals",
    instructor: "Jane Smith",
    description: "Master JavaScript from the ground up.",
    enrollmentStatus: "Open",
    duration: "4 weeks",
    syllabus: [
      { week: 1, topic: "Variables & Data Types" },
      { week: 2, topic: "Functions & Scope" },
      { week: 3, topic: "Asynchronous JavaScript & Promises" },
      { week: 4, topic: "DOM Manipulation & Events" },
    ],
    likes: 15,
  },
  {
    name: "Cybersecurity Fundamentals",
    instructor: "David Lee",
    description: "Understand cybersecurity concepts and ethical hacking.",
    enrollmentStatus: "Open",
    duration: "8 weeks",
    syllabus: [
      { week: 1, topic: "Introduction to Cybersecurity" },
      { week: 2, topic: "Network Security & Firewalls" },
      { week: 3, topic: "Malware & Threat Analysis" },
      { week: 4, topic: "Penetration Testing Basics" },
    ],
    likes: 22,
  },
  {
    name: "Machine Learning with Python",
    instructor: "Olivia Martinez",
    description: "An introduction to AI and machine learning using Python.",
    enrollmentStatus: "Open",
    duration: "10 weeks",
    syllabus: [
      { week: 1, topic: "Supervised Learning" },
      { week: 2, topic: "Unsupervised Learning" },
      { week: 3, topic: "Feature Engineering & Data Preprocessing" },
      { week: 4, topic: "Neural Networks & Deep Learning" },
    ],
    likes: 18,
  },
  {
    name: "Financial Investing for Beginners",
    instructor: "Richard Brown",
    description: "Learn how to invest in stocks, bonds, and crypto.",
    enrollmentStatus: "Open",
    duration: "5 weeks",
    syllabus: [
      { week: 1, topic: "Stock Market Basics" },
      { week: 2, topic: "Risk Management Strategies" },
      { week: 3, topic: "Introduction to Cryptocurrency" },
      { week: 4, topic: "Investment Portfolio Management" },
    ],
    likes: 25,
  },
  {
    name: "Digital Marketing Mastery",
    instructor: "Sophia White",
    description:
      "Learn SEO, social media marketing, and advertising techniques.",
    enrollmentStatus: "Open",
    duration: "6 weeks",
    syllabus: [
      { week: 1, topic: "SEO Basics & Content Strategy" },
      { week: 2, topic: "Facebook & Instagram Ads" },
      { week: 3, topic: "Google Ads & Pay-Per-Click" },
      { week: 4, topic: "Affiliate Marketing & Email Campaigns" },
    ],
    likes: 30,
  },
  {
    name: "Blockchain & Cryptocurrency",
    instructor: "Lucas Green",
    description:
      "Explore blockchain technology and cryptocurrencies like Bitcoin.",
    enrollmentStatus: "Open",
    duration: "7 weeks",
    syllabus: [
      { week: 1, topic: "Blockchain Fundamentals" },
      { week: 2, topic: "How Bitcoin Works" },
      { week: 3, topic: "Smart Contracts & Ethereum" },
      { week: 4, topic: "Decentralized Finance (DeFi)" },
    ],
    likes: 19,
  },
  {
    name: "UX/UI Design Principles",
    instructor: "Emma Carter",
    description: "Master user experience (UX) and user interface (UI) design.",
    enrollmentStatus: "Open",
    duration: "6 weeks",
    syllabus: [
      { week: 1, topic: "Design Thinking & User Research" },
      { week: 2, topic: "Wireframing & Prototyping" },
      { week: 3, topic: "Color Theory & Typography" },
      { week: 4, topic: "Usability Testing & Design Trends" },
    ],
    likes: 12,
  },
  {
    name: "Game Development with Unity",
    instructor: "Daniel Wilson",
    description: "Learn to build 2D and 3D games with Unity and C#.",
    enrollmentStatus: "Open",
    duration: "10 weeks",
    syllabus: [
      { week: 1, topic: "Introduction to Unity" },
      { week: 2, topic: "C# Programming Basics" },
      { week: 3, topic: "Physics & Game Mechanics" },
      { week: 4, topic: "Multiplayer & AI" },
    ],
    likes: 27,
  },
  {
    name: "Photography Essentials",
    instructor: "Olivia Adams",
    description: "Learn photography techniques for beginners.",
    enrollmentStatus: "Open",
    duration: "5 weeks",
    syllabus: [
      { week: 1, topic: "Camera Basics & Settings" },
      { week: 2, topic: "Lighting & Composition" },
      { week: 3, topic: "Editing with Photoshop" },
      { week: 4, topic: "Building a Photography Portfolio" },
    ],
    likes: 14,
  },
  {
    name: "Artificial Intelligence in Business",
    instructor: "James Scott",
    description:
      "Learn how AI is transforming industries and business strategies.",
    enrollmentStatus: "Open",
    duration: "6 weeks",
    syllabus: [
      { week: 1, topic: "AI Basics & Machine Learning Models" },
      { week: 2, topic: "AI in Marketing & Sales" },
      { week: 3, topic: "AI in Healthcare & Finance" },
      { week: 4, topic: "Ethics & Future of AI" },
    ],
    likes: 31,
  },
  {
    name: "Music Production with FL Studio",
    instructor: "Mark Johnson",
    description: "Learn how to produce music using FL Studio.",
    enrollmentStatus: "Open",
    duration: "7 weeks",
    syllabus: [
      { week: 1, topic: "Setting Up FL Studio" },
      { week: 2, topic: "Creating Drum Patterns" },
      { week: 3, topic: "Mixing & Mastering" },
      { week: 4, topic: "Song Arrangement & Publishing" },
    ],
    likes: 16,
  },
  {
    name: "Fitness & Nutrition Essentials",
    instructor: "Natalie Rogers",
    description: "Learn the fundamentals of fitness, exercise, and diet.",
    enrollmentStatus: "Open",
    duration: "5 weeks",
    syllabus: [
      { week: 1, topic: "Understanding Macronutrients" },
      { week: 2, topic: "Strength Training Basics" },
      { week: 3, topic: "Cardio & Weight Loss" },
      { week: 4, topic: "Meal Planning & Supplements" },
    ],
    likes: 29,
  },
];

// ✅ **Fix: Use addDoc() Instead of Batch Writes**
app.post("/add-courses", async (req, res) => {
  try {
    const coursesRef = db.collection("courses");

    // Use `map()` to create an array of promises, then wait for all to complete
    await Promise.all(sampleCourses.map((course) => coursesRef.add(course)));

    res.status(200).json({ message: "All courses added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
