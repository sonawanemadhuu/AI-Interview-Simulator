# AI Interview Simulator

An interactive web-based interview simulator designed to help users practice Technical, AI/ML, and HR interviews.

##  Features

* Technical interview practice
* AI/ML interview practice
* HR interview practice
* Dynamic question flow
* Text-based answer submission
* Voice recording functionality
* Answer analysis and scoring
* Interview summary
* Results dashboard
* Modern and responsive user interface

##  Tech Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Python
* FastAPI
* REST API

### Development Tools

* VS Code
* Git
* GitHub

##  Project Structure

```text
AI-Interview-Simulator/
│
├── backend/
│   ├── main.py
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

> The virtual environment (`venv`) is excluded from GitHub using `.gitignore`.

##  How the Application Works

1. The user opens the AI Interview Simulator.
2. The user selects an interview category such as Technical, AI/ML, or HR.
3. The application displays interview questions.
4. The user provides an answer by typing or using voice recording.
5. The frontend sends the answer to the FastAPI backend.
6. The backend processes the submitted answer.
7. The application displays the analysis, score, feedback, and interview summary.
8. The user can review their overall interview performance.

## 🔗 Frontend–Backend Communication

The frontend is developed using React.js and communicates with the Python FastAPI backend through REST API requests.

The React frontend sends user responses to the backend, and the backend processes the request and returns the required response to the frontend.

This demonstrates the integration of a modern frontend with a Python-based REST API.

##  How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/AI-Interview-Simulator.git
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Run the Backend

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Activate your Python virtual environment.

On Windows:

```powershell
.\venv\Scripts\activate
```

Install the required dependencies if a `requirements.txt` file is available:

```bash
pip install -r requirements.txt
```

Start the FastAPI server using the command configured in your project.

### 3. Run the Frontend

Open another terminal:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

##  Project Objective

The objective of this project is to create an interactive platform for interview preparation while demonstrating practical skills in:

* Frontend development
* React.js
* Backend development
* Python
* FastAPI
* REST API integration
* User interaction and state management
* Git and GitHub

##  Future Improvements

The project can be further improved by adding:

* More advanced AI-based answer evaluation
* Resume-based personalized interview questions
* User authentication
* Interview history
* PostgreSQL database integration
* Detailed performance analytics
* Personalized interview recommendations
* Improved answer feedback

##  Developer

**Madhura Sonawane**

B.E. Artificial Intelligence & Data Science
Datta Meghe College of Engineering

##  Note

This project was developed as a learning and portfolio project to gain practical experience in full-stack web development using React.js, Python, and FastAPI.
