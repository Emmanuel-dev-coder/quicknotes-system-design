const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
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
        const notes = await request(`${API_URL}?_limit=10`);
        notesList.replaceChildren();

        if (notes.length === 0) {
            showStatus("No notes found.");
            return;
        }

        notes.forEach(note => {
            notesList.appendChild(createNoteElement(note));
        });

        showStatus(`Loaded ${notes.length} notes from the server.`, "success");
    } catch (error) {
        showStatus(
            "Sorry, we couldn't load notes. Please check your connection and try again.",
            "error"
        );
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);