# 📚 **Course App**

A **full-stack** course management platform built with **React.js, Firebase, Redux Toolkit, and Tailwind CSS**. Users can browse courses, enroll, manage their profile, and track progress.

---

## 🚀 **Features**

- 🔐 **Authentication**: Google-based sign-in using Firebase.
- 📚 **Courses**: Users can view and search for courses.
- 🏫 **Enrollments**: Users can enroll in courses and track their progress.
- ❤️ **Likes**: Users can like their favorite courses.
- 📋 **Dashboard**: Enrolled courses are displayed in the dashboard with real-time updates.
- 💳 **Payments**: Integrated payment processing (simulated with Firestore).
- 📱 **Responsive Design**: Fully optimized UI using **Tailwind CSS**.

---

## 🛠 **Tech Stack**

- **Frontend**: React.js, Tailwind CSS, React Router
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore, Authentication), Express.js
- **Deployment**: Vercel / Netlify (Frontend) & Render / Firebase Functions (Backend)
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

Create a **.env** file in the root directory and add:

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

- 📌 **studentSlice.js** - Manages authentication (Google sign-in, logout)
- 📌 **courseSlice.js** - Fetches and stores courses
- 📌 **enrolmentsSlice.js** - Handles enrollments
- 📌 **likesSlice.js** - Manages course likes
- 📌 **paymentsSlice.js** - Processes payments

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

### **4️⃣ Payments Collection**

```json
{
  "userId": "user123",
  "courseId": "course123",
  "amount": 999,
  "timestamp": "2024-02-15T12:30:00",
  "status": "Success"
}
```

---

## 🌐 **Backend Server Setup**

To manage the **course data**, we need to run an **Express.js server** that adds courses to Firestore.

### **1️⃣ Install Dependencies**

Navigate to the server directory and install required packages:

```sh
cd server
npm install
```

### **2️⃣ Setup Firebase Admin SDK**

1️⃣ **Create a Firebase Service Account**

- Go to **Firebase Console** → Project Settings → Service Accounts
- Click **Generate new private key** and download `serviceAccountKey.json`

2️⃣ **Move the key file to the server folder**

- Place the downloaded file inside `/server/`

3️⃣ **Add `.env` for the server**

Create a `.env` file in `/server/` and add:

```sh
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

**IMPORTANT:** The private key must be wrapped in **quotes** to avoid issues.

### **3️⃣ Start Server**

```sh
npm start
```

### **4️⃣ Add Sample Courses**

To add sample courses to Firestore, **run the server once** and make a POST request.

```sh
curl -X POST http://localhost:5000/add-courses
```

This will populate Firestore with predefined courses.

---

## 🚀 **Deployment**

### **🔹 Deploy Frontend to Vercel**

```sh
vercel deploy
```

### **🔹 Deploy Backend to Render**

1️⃣ **Push the server folder to GitHub**  
2️⃣ **Go to [Render](https://render.com/)** → New Web Service  
3️⃣ **Connect to GitHub** and select the repository  
4️⃣ **Set up environment variables** from `.env`  
5️⃣ Click **Deploy**

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
