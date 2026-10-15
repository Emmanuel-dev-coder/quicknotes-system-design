# QuickNotes Data Model

## Overview

QuickNotes needs to store users, notes and tags. A user can have many notes, and a note can have many tags. The database uses four tables to organise this information and reduce repeated data.

## Entities and Columns

### 1. Users

| Column | Type | Key or purpose |
|---|---|---|
| id | INTEGER | Primary key |
| name | VARCHAR(100) | User's name |
| email | VARCHAR(255) | Unique email address |
| password_hash | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | Account creation time |

### 2. Notes

| Column | Type | Key or purpose |
|---|---|---|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| title | VARCHAR(100) | Required note title |
| body | TEXT | Note content |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### 3. Tags

| Column | Type | Key or purpose |
|---|---|---|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| name | VARCHAR(50) | Tag name |

### 4. Note_Tags

| Column | Type | Key or purpose |
|---|---|---|
| note_id | INTEGER | Foreign key to notes |
| tag_id | INTEGER | Foreign key to tags |

The combination of `note_id` and `tag_id` forms the primary key, preventing the same tag from being added to the same note more than once.

## Relationships

- **Users to Notes:** One-to-many. One user can create many notes, but each note belongs to one user.
- **Users to Tags:** One-to-many. A user can create several tags.
- **Notes to Tags:** Many-to-many. A note can have several tags, and a tag can be used on several notes. The `note_tags` table connects them.

## SQL Table Definitions

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## Example SQL Queries

### 1. Get all notes for one user

```sql
SELECT id, title, body, created_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC;
```

### 2. Find notes with their tags

```sql
SELECT notes.title, tags.name AS tag_name
FROM notes
JOIN note_tags ON notes.id = note_tags.note_id
JOIN tags ON note_tags.tag_id = tags.id
WHERE notes.user_id = 1;
```

### 3. Count notes for each user

```sql
SELECT users.name, COUNT(notes.id) AS note_count
FROM users
LEFT JOIN notes ON users.id = notes.user_id
GROUP BY users.id, users.name;
```

## Index

```sql
CREATE INDEX idx_notes_user_updated
ON notes (user_id, updated_at);
```

This index helps the database find a user's notes and sort them by their most recent update. It can make the common notes-list request faster as the database grows.

## SQL vs NoSQL

I would start with a relational SQL database such as PostgreSQL. QuickNotes has clear relationships between users, notes and tags, and it needs foreign keys and transactions to keep the data consistent.

A NoSQL database could be useful if the data structure changes frequently or if a particular access pattern needs it. However, SQL is a good starting choice because the relationships and queries are well defined. We can review the decision if usage grows and real performance measurements show a need to change.