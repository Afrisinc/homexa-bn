# Afrisinc API Response Standard

This document defines the **official response structure and response
codes** used across all Afrisinc services and products.\
These standards ensure consistency, readability, and scalability across
microservices, mobile apps, web apps, and internal tools.

---

## 📌 Response Structure

All API responses MUST follow this standard JSON format:

```json
{
  "success": true,
  "resp_msg": "Description message",
  "resp_code": 1000,
  "data": {}
}
```

### Field Definitions

---

Field Type Description

---

`success` boolean Indicates if the operation
was successful.

`resp_msg` string Human-readable message
describing the result.

`resp_code` number Internal Afrisinc response
code (explained below).

`data` any Payload returned by the
API. May be `null`.

---

---

## 📌 Response Code System

Afrisinc uses a **four-digit internal response code system** separate
from HTTP status codes.\
This provides clean categorization, easier debugging, and uniformity
across services.

### 🔢 Response Code Ranges

---

Range Category Description

---

**1xxx** Success Successful operations.

**2xxx** Client Errors Bad input, missing data,
validation issues.

**3xxx** Authentication & Login, token, or permission
Authorization issues.

**4xxx** Business Logic Errors Rule violations, conflicts,
operation not allowed.

**5xxx** System Errors Server, DB, timeout, or
unexpected issues.

**9xxx** Critical Errors Security incidents,
corruption, system failures.

---

---

## ✅ 1xxx --- Success Codes

Code Meaning

---

**1000** Success (generic)
**1001** Resource created
**1002** Resource updated
**1003** Resource deleted
**1004** Request accepted for processing

---

## ❗ 2xxx --- Client Error Codes

Code Meaning

---

**2000** Invalid request payload
**2001** Missing required fields
**2002** Invalid field format
**2003** Duplicate entry
**2004** Resource not found
**2005** Unsupported action

---

## 🔐 3xxx --- Authentication & Authorization

Code Meaning

---

**3000** Authentication required
**3001** Invalid credentials
**3002** Token expired
**3003** Token invalid
**3004** Access denied (insufficient permissions)

---

## ⚙️ 4xxx --- Business Logic Errors

Code Meaning

---

**4000** Operation not allowed
**4001** Business rule violation
**4002** Limit or quota reached
**4003** Conflict with current state
**4004** External/third-party service error

---

## 🛑 5xxx --- System & Server Errors

Code Meaning

---

**5000** Internal server error
**5001** Database error
**5002** Cache/service unavailable
**5003** Unexpected exception
**5004** Request timeout

---

## 🚨 9xxx --- Critical Errors

Code Meaning

---

**9000** System-wide failure
**9001** Data corruption detected
**9002** Security incident
**9003** Infrastructure outage

---

## 📚 Example Responses

### ✔️ Successful Example

```json
{
  "success": true,
  "resp_msg": "Profile updated successfully",
  "resp_code": 1002,
  "data": {
    "id": "123",
    "name": "John Doe"
  }
}
```

### ❌ Error Example

```json
{
  "success": false,
  "resp_msg": "Token expired",
  "resp_code": 3002,
  "data": null
}
```

---

## 🧩 Integration Guidelines

- HTTP status codes SHOULD still be accurate (e.g., 200, 400, 401,
  500).
- `resp_code` is for **internal logic**, monitoring, logs, and
  business workflows.
- All services across Afrisinc MUST use these codes for consistency.
- Each microservice may extend codes **within the assigned range**.

---

## 🏷️ Versioning

**Version:** 1.0.0\
Changes to this standard must be documented and approved before
implementation.

---

## © Afrisinc Ltd

Unified API Response Standard for all company services.
