# QuickNotes System Design

## About the Project

QuickNotes is a simple notes application used to practise making API requests and to plan how a real notes service could work at a larger scale.

The frontend uses HTML, CSS and JavaScript. It can load notes, create a note and delete a note using the JSONPlaceholder testing API. The project also includes documentation for the API, database and system architecture.

Note: JSONPlaceholder is a practice API. Creating or deleting notes does not permanently change its stored data.

## Project Files

- `index.html` — the page structure and notes form.
- `style.css` — the page styling and status messages.
- `api.js` — GET, POST and DELETE requests, validation and error handling.
- `docs/api-design.md` — planned REST endpoints and error responses.
- `docs/data-model.md` — database tables, relationships and SQL queries.
- `docs/architecture.md` — scaling estimates, architecture and request flows.

## How to Run the App

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension, or serve the folder with another local web server.
4. Click Load notes to fetch sample notes.
5. Use the form to create a note and the Delete buttons to remove notes from the current page.

An internet connection is required because the app sends requests to JSONPlaceholder.

## Documentation

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

## What I Learned

- How to use `fetch()` with GET, POST and DELETE requests.
- How to handle API errors and show loading, success and error messages.
- How to validate form input and display user-provided text safely with `textContent`.
- How to design related database tables using primary keys and foreign keys.
- How load balancers, caching, read replicas and background workers can help an application scale.

## Future Improvements

- Build a real backend API and connect it to a database.
- Add user registration and authentication.
- Save notes permanently instead of using a testing API.
- Add automated tests and improve accessibility.