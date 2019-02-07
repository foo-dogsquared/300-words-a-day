const MARKDOWN_TEXT_CONTAINER = document.querySelector("#editor");
const MARKDOWN_PREVIEW_CONTAINER = document.querySelector("#preview");
const MARKDOWN_PREVIEW_BOX = document.querySelector("#markdown-preview");
const MARKDOWN_TEXT_BOX = document.querySelector("#markdown-editor");
const NUMBER_OF_WORDS_CONTAINER = document.querySelector(".number-of-words");
const NUMBER_OF_CHARACTERS_CONTAINER = document.querySelector(".number-of-characters");
const TOGGLE_PREVIEW_BUTTON = document.querySelector(".toggle-preview");
let toggle_preview = false;

function indicate_words_and_characters() {
    const editor_content = MARKDOWN_TEXT_BOX.innerText;
    const words = editor_content.match(/\S+/g);
    NUMBER_OF_WORDS_CONTAINER.textContent = `${(!words) ? "no" : words.length} word${(!words || (words.length <= 1)) ? "" : "s"}`;

    const editor_characters_length = editor_content.length;
    NUMBER_OF_CHARACTERS_CONTAINER.textContent = `${(editor_characters_length <= 0) ? "no" : editor_characters_length} character${(editor_characters_length <= 1) ? "" : "s"}`;
}

MARKDOWN_TEXT_BOX.addEventListener("input", function(event) {
    indicate_words_and_characters();
    MARKDOWN_PREVIEW_BOX.innerHTML = marked(MARKDOWN_TEXT_BOX.innerText);
});

TOGGLE_PREVIEW_BUTTON.addEventListener("click", function(event) {
    toggle_preview = !toggle_preview;

    if (toggle_preview) {
        MARKDOWN_PREVIEW_CONTAINER.classList.add("display");
        MARKDOWN_PREVIEW_CONTAINER.classList.remove("no-display");
        MARKDOWN_TEXT_CONTAINER.classList.remove("display")
        MARKDOWN_TEXT_CONTAINER.classList.add("no-display");
    }
    else {
        MARKDOWN_TEXT_CONTAINER.classList.add("display");
        MARKDOWN_TEXT_CONTAINER.classList.remove("no-display");
        MARKDOWN_PREVIEW_CONTAINER.classList.remove("display")
        MARKDOWN_PREVIEW_CONTAINER.classList.add("no-display");
    }
});



// it's the current date without considering the hours, minutes, 
// and the seconds (and milliseconds) 
// but we're keeping the whole thing 
const current_date = new Date();

localforage.config({
    name: APP_DB_NAME,
    storeName: APP_SETTINGS_INSTANCE_NAME
});


const notes_instance = localforage.createInstance({
    name: APP_DB_NAME,
    storeName: APP_NOTES_LOCATION_STRING
});

class notes {
    constructor(content, date = new Date()) {
        this.date = date;
        this.content = content;
    }
}

function autosave() {
    console.log("Autosaving content...");
    notes_instance.length()
    .then(function(length) {
        // if there's no notes, then start the note train with ID = 1
        // else get the latest notes and check for the latest entry
        // if the latest entry is still on the current day, then update the note
        // else, then most likely it is a new date and should be created with another note
        if (length <= 0 || !length) notes_instance.setItem("1", new notes(MARKDOWN_TEXT_BOX.innerText));
        else notes_instance.getItem(Number(length).toString()).then(function(value) {
            if (value.date.toDateString() === new Date().toDateString()) notes_instance.setItem(Number(length).toString(), new notes(MARKDOWN_TEXT_BOX.innerText));
            else notes_instance.setItem(Number(length + 1).toString(), new notes(MARKDOWN_TEXT_BOX.innerText))
        })
    })
}

localforage.getItem(APP_AUTOSAVE_SETTING)
.then(function(value) {
    if (!value) setInterval(autosave, APP_AUTOSAVE_INTERVAL_DEFAULT_VALUE);
    else setInterval(autosave, value);
})
.catch(function(error) {
    console.error(error);
})

notes_instance.length()
.then(function(length) {
    // giving the feedback for the number of notes
    const notes_counter = document.querySelector(".notes-counter");
    notes_counter.textContent = `You have ${length} notes, so far.`;

    // until there's a note, there won't be any additional feedbacks
    if (!length) return;

    // retrieve the latest entry and put it into the editor box
    notes_instance.getItem(Number(length).toString())
    .then(function(note_object) {
        if (!note_object) return;
        else {
            MARKDOWN_TEXT_BOX.innerText = note_object.content;
            MARKDOWN_PREVIEW_BOX.innerHTML = marked(note_object.content);
            const input_event = new Event("input");
            MARKDOWN_TEXT_BOX.dispatchEvent(input_event);
        }
    })
    .catch(function(error) {
        console.error(error);
    })

    // checking if the streak is still going and update it accordingly
    notes_instance.getItem(Number(length - 1).toString())
    .then(function(note_object) {
        // getting the current date
        const current_date = new Date();

        // setting the date to the previous day
        current_date.setDate(current_date.getDate() - 1);
        if (!note_object) localforage.setItem(APP_NOTE_DAY_STREAK, 0);
        else if (current_date.toDateString() === note_object.date.toDateString()) localforage.getItem(APP_NOTE_DAY_STREAK).then(days => {localforage.setItem(APP_NOTE_DAY_STREAK, days++)});
        else localforage.setItem(APP_NOTE_DAY_STREAK, 0);
    })
    .catch(function(error) {
        console.error(error);
    })

    // retrieve the entries before the latest and render them
    const PREVIOUS_NOTES_BOX = document.querySelector(".notes-collection");
    if (length > 1) {
        notes_instance.iterate(function(note_object, key, iteration_index) {
            if (iteration_index === length) return;
            // TODO: create the html template for the previous notes
            const note_container = document.createElement("div");
            note_container.classList.add("note-container");
            if (iteration_index === 1) note_container.classList.add("display");
            else note_container.classList.add("no-display");

            const note_date = document.createElement("div");
            note_date.classList.add("note-date");
            note_date.textContent = note_object.date.toDateString();

            const note_content = document.createElement("div");
            note_content.classList.add("note-content");
            note_content.innerHTML = marked(note_object.content);

            const note_number_of_words = document.createElement("div");
            note_number_of_words.classList.add("note-word-count");
            note_number_of_words.textContent = `${note_object.content.match(/\S+/g).length} words`;

            note_container.appendChild(note_date);
            note_container.appendChild(note_content);
            note_container.appendChild(note_number_of_words);
            PREVIOUS_NOTES_BOX.appendChild(note_container);
        })
    }
})

const PREVIOUS_NOTE_BUTTON = document.querySelector(".previous-note-button");
const NEXT_NOTE_BUTTON = document.querySelector(".next-note-button");

// getting the previous note to be shown
PREVIOUS_NOTE_BUTTON.addEventListener("click", function(event) {
    const notes_collection = document.querySelector(".notes-collection");
    const rendered_note = document.querySelector(".note-container.display");

    if (rendered_note.previousElementSibling) {
        rendered_note.classList.remove("display");
        rendered_note.classList.add("no-display");
        rendered_note.previousElementSibling.classList.remove("no-display");
        rendered_note.previousElementSibling.classList.add("display");
    }
})

// getting the next note to be shown
NEXT_NOTE_BUTTON.addEventListener("click", function(event) {
    const notes_collection = document.querySelector(".notes-collection");
    const rendered_note = document.querySelector(".note-container.display");

    if (rendered_note.nextElementSibling) {
        rendered_note.classList.remove("display");
        rendered_note.classList.add("no-display");
        rendered_note.nextElementSibling.classList.remove("no-display");
        rendered_note.nextElementSibling.classList.add("display");
    }
})
