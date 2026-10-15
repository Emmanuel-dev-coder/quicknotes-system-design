const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return {
        data: response.status === 204 ? null : await response.json(),
        status: response.status
    };
}

function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

function createNoteElement(note) {
    const item = document.createElement("li");

    const title = document.createElement("h3");
    title.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body || "No body provided.";

    item.append(title, body);
    return item;
}

async function loadNotes() {
    loadButton.disabled = true;
    showStatus("Loading notes...");

    try {
        const result = await request(`${API_URL}?_limit=10`);
        notesList.replaceChildren();

        if (result.data.length === 0) {
            showStatus("No notes found.");
            return;
        }

        result.data.forEach(note => {
            notesList.appendChild(createNoteElement(note));
        });

        showStatus(`Loaded ${result.data.length} notes from the server.`, "success");
    } catch (error) {
        showStatus("Sorry, we couldn't load notes. Please check your connection and try again.", "error");
    } finally {
        loadButton.disabled = false;
    }
}

async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus("Please enter a note title.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus("The title must be 100 characters or fewer.", "error");
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    showStatus("Creating note...");

    try {
        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1
            })
        });

        notesList.prepend(createNoteElement(result.data));
        showStatus(`Note created successfully (status ${result.status}).`, "success");
        noteForm.reset();
    } catch (error) {
        showStatus("Sorry, we couldn't create the note. Please try again.", "error");
    } finally {
        submitButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);