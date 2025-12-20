# Secure Registration Backend

A production-ready backend for handling secure student registrations with strong validation, CAPTCHA protection, admin access control, and abuse prevention.

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

- Secure student registration API
- Invisible reCAPTCHA v2 for bot protection
- Development-only CAPTCHA bypass (env-protected)
- Joi-based request validation with clear error messages
- MongoDB unique constraints to prevent duplicate registrations
- Centralized error handling (no stack trace leaks in production)
- Admin-only APIs protected using API key authentication
- Pagination limit enforcement to prevent abuse
- Rate limiting to block spam and brute-force attempts
- Request ID middleware for debugging and tracing
- Production hardening using security best practices

---

## 🧠 Validation Strategy

- **Joi (API Layer)**  
  Ensures request data format and required fields before database access.

- **Mongoose (Database Layer)**  
  Ensures data integrity using schema rules and unique indexes.

---

## 📌 API Endpoints

### 1️⃣ Register Student


POST /api/v1/register


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


3️⃣ Health Check

GET /health
{ "status": "ok" }
