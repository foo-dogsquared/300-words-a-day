const markdown_text_container = document.querySelector("#editor");
const markdown_preview_container = document.querySelector("#preview");
const markdown_preview_box = document.querySelector("#markdown-preview");
const markdown_text_box = document.querySelector("#markdown-editor");
const number_of_words_container = document.querySelector(".number-of-words");
const number_of_characters_container = document.querySelector(".number-of-characters");
const toggle_preview_button = document.querySelector(".toggle-preview");
let toggle_preview = false;

function indicate_words_and_characters() {
    const editor_content = markdown_text_box.innerText;
    const words = editor_content.match(/\S+/g);
    number_of_words_container.textContent = `${(!words) ? "no" : words.length} word${(!words || (words.length <= 1)) ? "" : "s"}`;

    const editor_characters_length = editor_content.length;
    number_of_characters_container.textContent = `${(editor_characters_length <= 0) ? "no" : editor_characters_length} character${(editor_characters_length <= 1) ? "" : "s"}`;
}

markdown_text_box.addEventListener("input", function(event) {
    indicate_words_and_characters();
    markdown_preview_box.innerHTML = marked(markdown_text_box.innerText);
});

toggle_preview_button.addEventListener("click", function(event) {
    toggle_preview = !toggle_preview;

    if (toggle_preview) {
        markdown_preview_container.classList.add("display");
        markdown_preview_container.classList.remove("no-display");
        markdown_text_container.classList.remove("display")
        markdown_text_container.classList.add("no-display");
    }
    else {
        markdown_text_container.classList.add("display");
        markdown_text_container.classList.remove("no-display");
        markdown_preview_container.classList.remove("display")
        markdown_preview_container.classList.add("no-display");
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
        if (length <= 0 || !length) notes_instance.setItem("1", new notes(markdown_text_box.innerText));
        else notes_instance.getItem(Number(length).toString()).then(function(value) {
            if (value.date.toDateString() === new Date().toDateString()) notes_instance.setItem(Number(length).toString(), new notes(markdown_text_box.innerText));
            else notes_instance.setItem(Number(length + 1).toString(), new notes(markdown_text_box.innerText))
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
    if (!length) return;
    notes_instance.getItem(Number(length).toString())
    .then(function(note_object) {
        if (!note_object) return;
        else {
            markdown_text_box.innerText = note_object.content;
            markdown_preview_box.innerHTML = marked(note_object.content);
            const input_event = new Event("input");
            markdown_text_box.dispatchEvent(input_event);
        }
    })
    .catch(function(error) {
        console.error(error);
    })
})
