# DevArena

_A web application built mainly for higher institutions to make coding education more practical and engaging for computer science students._  

---

## 📋 **Table of Contents**
1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Workflow](#workflow)  
4. [Setup and Installation](#setup-and-installation)  
5. [Usage](#usage)  
6. [Screenshots](#screenshots)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Acknowledgments](#acknowledgments)

---

## 📖 **Introduction**  
Many students in computer science departments struggle with programming due to insufficient hands-on practice in their courses. This platform bridges the gap by providing:  
- **Practical programming tasks** tailored to academic levels.  
- Automated and manual code evaluation tools for both students and instructors.  
- A robust system to track student progress and enforce deadlines.

**Mission:** To empower students with practical coding skills through interactive projects based on their syllabus and automated feedback.  

---

## ✨ **Features**
- **User Authentication:** Secure login and registration for students and instructors.
- **Task Management:** Create, assign, and manage programming tasks.
- **Automated Grading:** Real-time feedback and automated code evaluation.
- **Progress Tracking:** Monitor student progress and performance.
- **Collaboration Tools:** Discussion forums and peer reviews.
- **Resource Sharing:** Upload and share study materials and resources.

---

## ⚙️ **Workflow**

This product is built using the following widely used technologies:

### **Frontend**
- Tailwind CSS [tailwindcss.com](https://tailwindcss.com/) / Material UI [mui.com](https://mui.com/)
- React [![React](https://img.shields.io/badge/React-17.x-blue?logo=react)](https://reactjs.org/)
- Axios [axios-http.com](https://axios-http.com)

### **Backend**
- Python Flask
- SQLAlchemy

### **Database**
- MySQL

---

## ⚙️ **Setup and Installation**  

### **Prerequisites**  
- Python 3.x  
- Node.js
- MySQL  
- Redis
- Virtual Environment (optional)  

### **Steps**  
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/Tommytinny/DevArena.git
   cd DevArena
   ```
2. **Set Up Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install MySQL**
   - **On Ubuntu/Debian:**
     ```bash
     sudo apt update
     sudo apt install mysql-server
     sudo mysql_secure_installation
     ```
   - **On macOS:**
     ```bash
     brew install mysql
     brew services start mysql
     ```
   - **On Windows:**
     Download and install MySQL from the [official website](https://dev.mysql.com/downloads/installer/).

4. **Navigate to the Backend Directory**
   ```bash
   cd backend
   ```

5. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

6. **Set Up Environment Variables**
   Create a `.env` file in the backend directory and add the following environment variables:
   ```env
   ENV=development
   API_HOST=0.0.0.0
   API_PORT=5000
   AUTH_TYPE=JWT
   MYSQL_USER=your_username
   MYSQL_PWD=your_password
   MYSQL_HOST=localhost
   MYSQL_DB=DevArena
   SECRET_KEY=your_secret_key
   ```

8. **Start the Backend API Server**
   ```bash
   python3 -m api.v1.app
   ```
   The application will start on `http://localhost:3000`.

9. **Navigate to the Frontend Directory**
   ```bash
   cd ../frontends
   ```

10. **Install Frontend Dependencies**
    ```bash
    npm install
    ```

11. **Start the Frontend Server**
    ```bash
    npm run dev
    ```
    The application will start on `http://localhost:5173`.

---

## 🚀 **Usage**

### **Student Workflow**
1. Log in to access your dashboard.
2. Select active projects and view assigned tasks.
3. Complete tasks and upload your solutions.
4. View real-time feedback and improve your code.

### **Instructor Workflow**
1. Log in with an instructor account.
2. Create programming projects with tasks and assign deadlines.
3. Review and grade student submissions.
4. Manage the course progress and provide feedback.


---

## 🤝 **Contributing**
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

## 📜 **License**
This project is licensed under the MIT License. Feel free to use, modify, and distribute this project with proper attribution.

---

## 🙌 **Acknowledgments**
- Inspired by practical learning initiatives in computer science education.
_ Inspired by alx intranet platform.
