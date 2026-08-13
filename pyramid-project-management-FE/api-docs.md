# Pyramid Project Management - API Documentation

This document describes the NestJS backend API endpoints that power the application.

## Authentication
Currently, the application relies on an authentication token that should be passed in the `Authorization` header as a Bearer token:
`Authorization: Bearer <token>`

## Endpoints

### 1. Profile (`/profile`)

#### `GET /profile`
Returns the current user profile.
- **Response**: `Profile` object.

#### `PATCH /profile`
Updates the current user profile.
- **Body**:
  ```json
  {
    "name": "string?",
    "title": "string?",
    "username": "string?"
  }
  ```
- **Response**: Updated `Profile` object.

### 2. Members (`/members`)

#### `GET /members`
Returns a list of all workspace members.
- **Response**: Array of `Member` objects.

### 3. Labels (`/labels`)

#### `GET /labels`
Returns a list of all available task labels.
- **Response**: Array of `string`s.

### 4. Tasks (`/tasks`)

> **Note on Projects and Tasks**: Tasks can optionally belong to a Project. This is represented by the `projectId` field on the Task object. You can fetch all tasks for a project using either `GET /tasks?projectId=:id` or `GET /projects/:id/tasks`. Tasks can be reassigned to different projects by sending a `PATCH` request with a new `projectId`.

#### `GET /tasks`
Returns a list of tasks. Supports query parameters for filtering.
- **Query Params**:
  - `status`: Filter by task status (e.g., `todo`, `doing`).
  - `priority`: Filter by priority (e.g., `urgent`, `high`).
  - `search`: Search query string.
  - `projectId`: Filter tasks belonging to a specific project.
- **Response**: Array of `Task` objects.

#### `GET /tasks/:id`
Returns the details of a specific task.
- **Response**: `Task` object.

#### `POST /tasks`
Creates a new task.
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string?",
    "priority": "string?",
    "status": "string?",
    "projectId": "string?",
    "dueDate": "string?",
    "memberIds": ["string"]
  }
  ```
- **Response**: Created `Task` object.

#### `PATCH /tasks/:id`
Updates an existing task.
- **Body**: Partial Task object (same fields as `POST`).
- **Response**: Updated `Task` object.

#### `DELETE /tasks/:id`
Deletes a task by ID.
- **Response**: `204 No Content`.

#### `POST /tasks/:id/comments`
Adds a comment to a task.
- **Body**:
  ```json
  {
    "body": "string"
  }
  ```
- **Response**: Created `Comment` object.

#### `POST /tasks/:id/subtasks`
Adds a subtask to a task.
- **Body**:
  ```json
  {
    "title": "string",
    "priority": "string?",
    "dueDate": "string?"
  }
  ```
- **Response**: Created `SubTask` object.

### 5. Projects (`/projects`)

#### `GET /projects`
Returns a list of all projects. Supports filtering.
- **Query Params**:
  - `search`: Search query string.
  - `priority`: Filter by priority.
- **Response**: Array of `Project` objects.

#### `GET /projects/:id`
Returns a specific project's details.
- **Response**: `Project` object.

#### `GET /projects/:id/tasks`
Returns a list of tasks that belong to the specified project.
- **Response**: Array of `Task` objects.

#### `POST /projects`
Creates a new project.
- **Body**:
  ```json
  {
    "name": "string",
    "priority": "string?",
    "leadId": "string?",
    "dueDate": "string?"
  }
  ```
- **Response**: Created `Project` object.

#### `PATCH /projects/:id`
Updates an existing project.
- **Body**: Partial Project object (same fields as `POST`).
- **Response**: Updated `Project` object.

#### `DELETE /projects/:id`
Deletes a project by ID.
- **Response**: `204 No Content`.
