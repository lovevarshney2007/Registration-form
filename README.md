# Secure Registration Backend

A production-ready backend for handling secure student registrations with strong validation, CAPTCHA protection, admin access control, and an AI-powered chatbot, built with real-world backend security practices.

This project is designed using **real-world backend security practices** and is suitable for production deployment.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Joi** – Request validation
- **Google reCAPTCHA v2 (Invisible)**
- **Helmet** – Security headers
- **CORS** – Origin control
- **Rate Limiting**
- **Request ID tracing**



---
## 🔐 Key Features

### Registration System
- Secure student registration API
- Invisible reCAPTCHA v2 protection
- Development-only CAPTCHA bypass (env protected)
- Joi + Mongoose dual-layer validation
- Duplicate registration prevention

### Chatbot System
- AI-powered chatbot
- Normal chat and streaming chat support
- Thread-based conversation memory
- Follow-up suggestion generation
- Swagger-documented APIs

### Security & Hardening
- Centralized error handling
- No stack traces leaked in production
- Admin APIs protected via API key
- Rate limiting to prevent abuse
- Request ID tracing for debugging





---
## 🧠 Validation Strategy

### API Layer (Joi)
- Validates request structure
- Blocks malformed requests early

### Database Layer (Mongoose)
- Schema-level validation
- Unique indexes for data integrity

---

## 📌 API Endpoints

---

## 🧾 Registration APIs

### 1️⃣ Register Student

**POST**

 /api/v1/register


**Request Body**
```json
{
  "name": "John Doe",
  "studentNumber": "2412345",
  "email": "john2412345@akgec.ac.in",
  "gender": "Male",
  "branch": "CSE",
  "phone": "9876543210",
  "unstopId": "john_doe",
  "residence": "Hosteller",
  "captchaToken": "<recaptcha-token>"
}

Success Response

{
  "success": true,
  "message": "Registration Successful",
  "data": { ... },
  "requestId": "uuid"
}

2️⃣ Get All Registrations (Admin Only)

GET 
/api/v1/registrations


Headers
x-admin-key: <ADMIN_API_KEY>



3️⃣ Health Check



GET /health
{ "status": "ok" }


🤖 Chatbot APIs
 
Base Route: /api/v1/chatbot

4️⃣ Chat (Non-Streaming)

POST

/api/v1/chatbot/chat

Request Body
{
  "query": "What is CCC?",
  "thread_id": null
}

Response
{
  "success": true,
  "message": "Chat response fetched",
  "data": {
    "answer": "CCC stands for Cloud Computing Cell...",
    "thread_id": "abc123",
    "tool_type": "rag",
    "tool_name": "retrieve_society_info"
  },
  "requestId": "uuid"
}

5️⃣ Chat Stream (Real-Time)

POST

/api/v1/chatbot/chat/stream

Request Body
{
  "query": "What is CCC?",
  "thread_id": "init"
}

Response

Server-Sent Events (SSE)

Token-by-token streamed output

6️⃣ Suggest Follow-up Questions

POST

/api/v1/chatbot/suggest

Request Body
{
  "final_answer": "CCC is a student-run cloud society...",
  "thread_id": "abc123"
}

Response
{
  "suggestions": [
    "How can I join CCC?",
    "What events does CCC organize?"
  ],
  "thread_id": "abc123"
}



