# QuickNotes API Design

## Overview

The QuickNotes API allows users to create, view, update and delete notes. It also supports organising notes with tags. The API uses REST principles and JSON for sending and receiving data.

Base URL: `/api/v1`

## API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/notes` | Get a list of notes | 200 OK |
| GET | `/notes/:id` | Get one note by ID | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PUT | `/notes/:id` | Update an existing note | 200 OK |
| DELETE | `/notes/:id` | Delete a note | 204 No Content |
| GET | `/tags` | Get all tags | 200 OK |
| POST | `/notes/:id/tags` | Add a tag to a note | 201 Created |
| DELETE | `/notes/:id/tags/:tagId` | Remove a tag from a note | 204 No Content |

## List Notes

Request:

`GET /api/v1/notes`

Example response (`200 OK`):

```json
{
  "data": [
    {
      "id": 12,
      "userId": 4,
      "title": "Shopping list",
      "body": "Buy milk and bread",
      "createdAt": "2026-10-15T09:00:00Z",
      "updatedAt": "2026-10-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

## Create a Note

Request:

`POST /api/v1/notes`

Example request body:

```json
{
  "title": "Meeting notes",
  "body": "Discuss the project plan"
}
```

Example response (`201 Created`):

```json
{
  "data": {
    "id": 25,
    "userId": 4,
    "title": "Meeting notes",
    "body": "Discuss the project plan",
    "createdAt": "2026-10-15T10:30:00Z",
    "updatedAt": "2026-10-15T10:30:00Z"
  }
}
```

The server gets the user ID from the authenticated user rather than trusting a user ID supplied in the request body.

## Error Responses

The API uses standard HTTP status codes to explain what went wrong.

| Status | Meaning | Example |
|---|---|---|
| 400 | Bad Request | The title is missing or too long |
| 401 | Unauthorized | The user has not signed in |
| 403 | Forbidden | The user cannot access this note |
| 404 | Not Found | The requested note does not exist |
| 500 | Internal Server Error | Something went wrong on the server |

Example error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The title is required."
  }
}
```

## Validation and Security

- A note title is required and must be no longer than 100 characters.
- The body can be optional.
- Users should only be able to read, update or delete their own notes.
- The server must validate incoming data even if the browser already validates it.
- The API should require authentication for private notes.
- Requests and responses use JSON, and errors should return a useful message without exposing private server details.

## Notes

The frontend demo uses JSONPlaceholder to practise GET, POST and DELETE requests. This document describes the planned QuickNotes API, which would be implemented by a real backend.