### 📚 **Course App**

A **full-stack** course management platform built with **React.js, Firebase, Redux Toolkit, and Tailwind CSS**. Users can browse courses, enroll, manage their profile, and track progress.

---

## 🚀 **Features**

- 🔐 **Authentication**: Google-based sign-in using Firebase.
- 📚 **Courses**: View and search for courses.
- 🏫 **Enrollments**: Users can enroll in courses and track progress.
- ❤️ **Likes**: Users can like courses.
- 📋 **Dashboard**: View enrolled courses with real-time updates.
- 📱 **Responsive Design**: Fully responsive UI using Tailwind CSS.

---

## 🛠 **Tech Stack**

- **Frontend**: React.js, Tailwind CSS, React Router
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore, Authentication)
- **Deployment**: Vercel / Netlify
- **Database**: Firestore (NoSQL)
- **Icons**: React Icons

---

## ⚡ **Project Setup**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/LCB2021051/course-app.git
cd course-app
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Setup Firebase**

Create a **.env** file in the root and add:

```sh
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### **4️⃣ Start Development Server**

```sh
npm run dev
```

The app runs at **http://localhost:5173**

---

## 🏗 **Project Structure**

```
/course-app
│── /public                # Static assets
│── /src
│   │── /components        # Reusable UI components
│   │── /pages             # Pages (Home, Course, Dashboard)
│   │── /redux             # Redux Toolkit store, slices, thunks
│   │── /firebaseConfig.js # Firebase configuration
│   │── /App.js            # Main app entry point
│   │── /main.jsx          # ReactDOM render
│── .gitignore             # Ignore sensitive files
│── package.json           # Dependencies & scripts
│── README.md              # Project documentation
```

---

## 🔥 **Redux Store (State Management)**

### **📝 Redux Slices**

📌 **studentSlice.js** - Handles authentication  
📌 **courseSlice.js** - Fetches courses  
📌 **enrolmentsSlice.js** - Manages enrollments  
📌 **likesSlice.js** - Tracks course likes

---

## 🔄 **Redux Thunks**

### **1️⃣ Fetch Courses**

```js
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### **2️⃣ Enroll a Student**

```js
export const enrolStudent = createAsyncThunk(
  "enrolments/enroll",
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      await addDoc(collection(db, "enrolments"), {
        studentId: userId,
        courseId,
      });
      return { userId, courseId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### **3️⃣ Process Payment**

```js
export const processPayment = createAsyncThunk(
  "payment/process",
  async ({ userId, courseId, amount }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "payments"), {
        userId,
        courseId,
        amount,
        timestamp: serverTimestamp(),
      });
      return { id: docRef.id, userId, courseId, amount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## 📂 **Firestore Schema**

### **1️⃣ Courses Collection**

```json
{
  "id": "course123",
  "name": "React for Beginners",
  "description": "Learn React.js from scratch",
  "image": "course-image.jpg",
  "likes": 25
}
```

### **2️⃣ Enrollments Collection**

```json
{
  "studentId": "user123",
  "courseId": "course123",
  "timestamp": "2024-02-15T10:00:00"
}
```

### **3️⃣ Likes Collection**

```json
{
  "userId": "user123",
  "courseId": "course123"
}
```

---

## 🚀 **Deployment**

### **🔹 Build for Production**

```sh
npm run build
```

### **🔹 Deploy to Vercel**

```sh
vercel deploy
```

---

## 📝 **Future Enhancements**

✅ Add **course progress tracking**  
✅ Implement **discussion forums**  
✅ Add **instructor dashboard**  
✅ Enable **payment gateway integration**

---

## 🤝 **Contributing**

Feel free to contribute by submitting a **pull request**. Open issues if you find bugs.

---

## 📞 **Contact**

**Vivek Korah**  
📧 **Email**: [lcb2021051@iiitl.ac.in](mailto:lcb2021051@iiitl.ac.in)  
🔗 **LinkedIn**: [linkedin.com/in/vivek-korah](https://www.linkedin.com/in/vivek-korah-0b39b7233/)  
💻 **GitHub**: [github.com/LCB2021051](https://github.com/LCB2021051)

---
