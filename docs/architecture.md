# QuickNotes System Architecture

## 1. Overview

QuickNotes is a notes application where users can create, view, update and delete their notes. The current project demonstrates API requests in the browser. For one million users, I would use a backend service and a database instead of keeping all the data in the browser.

## 2. Requirements

### Functional requirements

- Users can sign in and access their own notes.
- Users can create, view, update and delete notes.
- Users can organise notes using tags.
- The system returns useful error messages when a request fails.

### Non-functional requirements

- The system should remain available when one application server fails.
- Common requests should respond quickly.
- Private notes must be protected from other users.
- The system should handle increased traffic as more people join.
- Data should be backed up so it can be recovered after a failure.

## 3. Load Estimates

These are planning estimates, not measured traffic. I assume one million registered users, with 100,000 daily active users. Each active user makes about 20 read requests and 2 write requests per day.

### Read requests per second

100,000 users × 20 reads = 2,000,000 reads per day.

2,000,000 ÷ 86,400 seconds = about 23 reads per second on average.

### Write requests per second

100,000 users × 2 writes = 200,000 writes per day.

200,000 ÷ 86,400 seconds = about 2.3 writes per second on average.

Real traffic will not be evenly spread throughout the day, so the system should be able to handle much higher peak traffic.

### Storage per year

Assume each stored note uses about 2 KB of text and metadata, and each active user creates 2 notes per day.

100,000 × 2 × 2 KB = about 400 MB of new note data per day.

400 MB × 365 = about 146 GB per year.

This estimate excludes database indexes, backups, replicas and other overhead. Actual storage will depend on note sizes and user activity.

## 4. Architecture Diagram

```text
                    Users / Browser
                           |
                          DNS
                           |
                          CDN
                           |
                     Load Balancer
                      /         \
             App Server 1     App Server 2
                      \         /
                       \       /
                      Cache (e.g. Redis)
                           |
                    Primary Database
                           |
                      Read Replica

             App Servers
                  |
             Message Queue
                  |
             Background Worker
```

### Components

- **Browser:** Displays the notes interface and sends API requests.
- **DNS:** Converts the application domain name into the correct network address.
- **CDN:** Serves static files such as HTML, CSS and JavaScript from locations closer to users.
- **Load balancer:** Distributes requests across application servers.
- **Application servers:** Validate requests, check permissions and run the API logic. At least two servers allow the service to keep working if one fails.
- **Cache:** Stores frequently requested data temporarily to reduce database load. Private cached data must be separated by user.
- **Primary database:** Stores users, notes and tags and handles writes.
- **Read replica:** Handles suitable read requests to reduce load on the primary database.
- **Message queue:** Holds background jobs so they can be processed without slowing down the user's request.
- **Background worker:** Processes jobs such as sending notifications or cleaning up old temporary data.

## 5. Request Flows

### GET /notes

1. The user opens the notes page and requests their notes.
2. DNS resolves the application domain.
3. The CDN can serve static frontend files if they are not already cached in the browser.
4. The load balancer sends the API request to an available application server.
5. The server checks the user's authentication and permissions.
6. The server checks the cache for the user's notes.
7. If the data is not cached, the server reads the notes from the database or an appropriate read replica.
8. The server returns the notes as JSON.
9. The frontend displays the notes.

### POST /notes

1. The user submits a new note.
2. The load balancer sends the request to an application server.
3. The server checks authentication, validates the title and body, and confirms the user has permission to create the note.
4. The server writes the new note to the primary database.
5. The server invalidates or updates relevant cached data.
6. The server returns a `201 Created` response containing the new note.
7. Any extra work, such as sending a notification, can be placed on the message queue for a worker to handle later.

## 6. Trade-offs

### SQL database vs NoSQL

I would start with PostgreSQL because users, notes and tags have clear relationships. SQL constraints and transactions help protect data consistency. A NoSQL database could be considered later if measured requirements justify it, but it would add complexity at the beginning.

### Cache vs fresh data

Caching can make frequently requested notes faster to load and reduce database work. However, cached data can become outdated. The application should invalidate or update the cache when a note changes, and it should avoid returning one user's private notes to another user.

### Read replicas vs consistency

Read replicas can handle more read traffic, but replication may take time. A user might not immediately see a recent write if the next read goes to a replica. For requests that need the latest data, the application can read from the primary database.

### Background jobs vs immediate processing

A queue keeps slower tasks out of the main request path, which helps the app respond quickly. The trade-off is that background jobs may finish later, so the system needs retries and monitoring.

## 7. Avoiding Single Points of Failure

- Run at least two application servers behind a load balancer.
- Use health checks so unhealthy servers stop receiving traffic.
- Deploy the application across multiple availability zones where possible.
- Configure database backups and test recovery regularly.
- Use database replication and a documented failover process.
- Monitor the queue and workers, and retry failed jobs safely.
- Avoid depending on a single cache instance; configure redundancy or allow the app to fall back to the database if the cache is unavailable.

## Conclusion

This architecture gives QuickNotes a starting point for supporting one million registered users. I would monitor actual traffic, response times, errors and database growth before increasing infrastructure. Scaling decisions should be based on real usage rather than estimates alone.