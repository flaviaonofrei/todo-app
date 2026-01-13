# To-Do App — Technical Documentation

## 1. Overview

To-Do App is a modern full-stack task management application built using the MERN stack (MongoDB, Express, React, Node.js) and integrated with Firebase Firestore for cloud-based data persistence.

The application allows users to create, edit, prioritize and track tasks through a clean, responsive and intuitive user interface.

---

## 2. Technical Objectives

- Full-stack architecture using React 18 and Node.js  
- REST API for task management  
- Cloud persistence using Firebase Firestore  
- Input validation and data sanitization  
- Priority-based task classification  
- Due date management  
- Responsive modern UI  
- Production-ready deployment (Netlify and Render)  

---

## 3. Core Features

- Create, update and delete tasks  
- Assign priority (Critical, High, Medium, Low)  
- Set and edit due dates  
- Mark tasks as completed  
- Filter tasks by priority  
- Visual status indicators  

---

## 4. Technology Stack

### Frontend
- React 18  
- Vite  
- Tailwind CSS  
- React Icons  
- Fetch / Axios  

### Backend
- Node.js  
- Express.js  
- Firebase Admin SDK  
- CORS  
- dotenv  

### Database
- Firebase Firestore (NoSQL cloud database)  

---

## 5. Application Architecture

The application follows a classic client–server architecture.

The React frontend handles:
- UI rendering  
- State management  
- User interactions  
- API communication  

The Express backend handles:
- REST API endpoints  
- Data validation  
- Communication with Firebase Firestore  
- Business logic  

Firebase Firestore stores all task data in the cloud.

---

## 6. Data Model

Each task stored in Firestore follows this structure:

```json
{
  "id": "string",
  "title": "string",
  "priority": "critical | high | medium | low",
  "dueDate": "ISO date or null",
  "completed": "boolean",
  "createdAt": "ISO date"
}

---
## 7. REST API

### Task endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | /tasks | Retrieve all tasks |
| POST | /tasks | Create a new task |
| PATCH | /tasks/:id | Update task data |
| PATCH | /tasks/:id/title | Update task title |
| PATCH | /tasks/:id/dueDate | Update due date |
| DELETE | /tasks/:id | Delete a task |

---

## 8. Backend Validation Rules

The backend enforces the following rules:
- Title is required  
- Title maximum length is 100 characters  
- Priority must be one of: critical, high, medium, low  
- Due date must be a valid date or null  

This ensures data integrity and prevents invalid records from being stored.

---

## 9. User Interface

The frontend displays tasks as cards containing:
- Title  
- Status (pending or completed)  
- Priority badge  
- Due date  

Users can:
- Add tasks via an input form  
- Edit titles inline  
- Change priorities  
- Modify due dates  
- Mark tasks as completed  
- Delete tasks  

Filtering allows users to view only tasks of a selected priority.

---

## 10. Deployment

The application is designed for cloud deployment:

- Frontend is deployed on Netlify  
- Backend is deployed on Render  
- Firebase Firestore provides cloud data storage  

Environment variables are used to securely store API URLs and credentials.

---

## 11. Extensibility

The project architecture allows easy future extension, such as:
- User authentication  
- Multi-user task lists  
- Task categories  
- Notifications  
- Export to PDF or Excel  
- Analytics dashboards  

---

## 12. Conclusion

The To-Do App is a scalable, cloud-based, full-stack application demonstrating modern web development practices. It combines a responsive React frontend with a secure and efficient Node.js backend, backed by Firebase Firestore for reliable data storage. The project provides a solid foundation for building productivity and task management platforms.
