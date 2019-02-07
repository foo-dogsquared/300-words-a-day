const APP_NAME = `_300wads`

// database instance names
const APP_DB_NAME = `${APP_NAME}_db`
const APP_SETTINGS_INSTANCE_NAME = `${APP_NAME}_settings`;
const APP_NOTES_LOCATION_STRING = `${APP_NAME}_notes`;

// autosave settings
const APP_AUTOSAVE_SETTING = `${APP_NAME}_autosync_interval`;
const APP_AUTOSAVE_INTERVAL_DEFAULT_VALUE = 60000; // 60 seconds
const APP_NOTE_DAY_STREAK = `${APP_NAME}_day_streak`;

// markdown flavor settings
const APP_MARKDOWN_FLAVOR_SETTING = `${APP_NAME}_markdown_flavor`;

// unified notes object name (not editable since it will be stored on IndexedDB)
const APP_NOTES_INDEX = 0;

// general error messages
const GET_SELECTION_NOT_SUPPORTED = `Document selection is not supported (for some reason).`;
const LOCALFORAGE_ERROR = `The library 'localforage' has encountered an error. Please try again.`;

function render_date(date_container = document.querySelector("#current-date")) {
    date_container.textContent = new Date().toDateString();
}

render_date();
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
            markdown_text_box.innerText = note_object.content;
            markdown_preview_box.innerHTML = marked(note_object.content);
            const input_event = new Event("input");
            markdown_text_box.dispatchEvent(input_event);
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
    const previous_notes_box = document.querySelector(".notes-collection");
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
            previous_notes_box.appendChild(note_container);
        })
    }
})

const previous_note_button = document.querySelector(".previous-note-button");
const next_note_button = document.querySelector(".next-note-button");
previous_note_button.addEventListener("click", function(event) {
    const notes_collection = document.querySelector(".notes-collection");
    const rendered_note = document.querySelector(".note-container.display");

    if (rendered_note.previousElementSibling) {
        rendered_note.classList.remove("display");
        rendered_note.classList.add("no-display");
        rendered_note.previousElementSibling.classList.remove("no-display");
        rendered_note.previousElementSibling.classList.add("display");
    }
})

next_note_button.addEventListener("click", function(event) {
    const notes_collection = document.querySelector(".notes-collection");
    const rendered_note = document.querySelector(".note-container.display");

    if (rendered_note.nextElementSibling) {
        rendered_note.classList.remove("display");
        rendered_note.classList.add("no-display");
        rendered_note.nextElementSibling.classList.remove("no-display");
        rendered_note.nextElementSibling.classList.add("display");
    }
})

const markdown_syntax = {
    bold: "**",
    italic: "*",
    prerendered: "`",
    headings: "#",
    strikethrough: "--",
    code_block: "```",
    blockquote: "> ",
    horizontal_rule: "---"
}

function convert_to_regex_string(string) {
    let regex_string = "";
    const regex_compliant_characters = ["*", "+", "(", ")", "{", "}", "$", ".", "[", "]", "?"];
    for (let char = 0, length = string.length; char < length; char++) {
        if (regex_compliant_characters.includes(string[char])) regex_string += `\\${string[char]}`;
        else regex_string += string[char];
    }
    
    return regex_string;
}

function surround_text(text_string, surrounding_string) {
    if (text_string.trim() === text_string && !Boolean(text_string.trim())) return "";
    // also it could remove the surrounding string if the string was already surrounded
    const surrounding_string_regex_string = convert_to_regex_string(surrounding_string);
    const surrounding_string_regex = new RegExp(`^\\s*(${surrounding_string_regex_string}(.+)${surrounding_string_regex_string})\\s*$`);
    const regex_match = text_string.match(surrounding_string_regex);
    if (regex_match) return text_string.replace(regex_match[1], regex_match[2]);
    else {
        const trimmed_string = text_string.trim();
        const result_string = `${surrounding_string}${trimmed_string}${surrounding_string}`;
        return text_string.replace(trimmed_string, result_string);
    };
}

function preprend_text(text_string, prepending_string) {
    const text_string_trimmed = text_string.trim();
    const surrounding_string_regex_string = convert_to_regex_string(surrounding_string);
    const surrounding_string_regex = new RegExp(`^${surrounding_string_regex_string}(.+)${surrounding_string_regex_string}$`);
    const regex_match = text_string_trimmed.match(surrounding_string_regex);
    if (regex_match) return regex_match[1];
    return `${prepending_string} ${text_string}`;
}

function replace_selection_text(replacement_text, callback) {
    if (document.getSelection) {
        // getting the selection object
        // you can refer here: https://developer.mozilla.org/en-US/docs/Web/API/Selection/
        const selection_object = document.getSelection();

        // we are getting each selected fragment (or range) 
        // and starting to iterate through them
        // you can refer here to know what is a range: https://developer.mozilla.org/en-US/docs/Web/API/Range
        if (selection_object.rangeCount >= 1) {
            for (let range_index = 0, range_count = selection_object.rangeCount; range_index < range_count; range_index++) {
                const range = selection_object.getRangeAt(range_index);
                const content_string = range.toString();
                range.deleteContents();
                range.insertNode(document.createTextNode(callback(content_string, replacement_text)));
            }
        }
    }
    else throw new Error(GET_SELECTION_NOT_SUPPORTED);
}

// keyboard shortcuts in the markdown textbox
markdown_text_box.addEventListener("keydown", function(event) {
    const input_event = new Event("input");
    if (event.getModifierState("Control")) {
        // saving function (Ctrl + S)
        if (event.keyCode === "S".codePointAt(0) || event.keyCode === "s".codePointAt(0)) {
            event.preventDefault();
            autosave();
        }
        // making the text bold in markdown (Ctrl + B)
        else if (event.keyCode === "B".codePointAt(0) || event.keyCode === "b".codePointAt(0)) {
            event.preventDefault();
            replace_selection_text(markdown_syntax.bold, surround_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text italic in markdown (Ctrl + I)
        else if (event.keyCode === "I".codePointAt(0) || event.keyCode === "i".codePointAt(0)) {
            event.preventDefault();
            replace_selection_text(markdown_syntax.italic, surround_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text to be the head heading (Ctrl + 1)
        else if (event.keyCode === "1".codePointAt(0)) {
            event.preventDefault();
            const headers = markdown_syntax.headings.repeat(1);
            replace_selection_text(headers, preprend_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text to be the subheading (Ctrl + 2)
        else if (event.keyCode === "2".codePointAt(0)) {
            event.preventDefault();
            const headers = markdown_syntax.headings.repeat(2);
            replace_selection_text(headers, preprend_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text to be the head heading (Ctrl + 3)
        else if (event.keyCode === "3".codePointAt(0)) {
            event.preventDefault();
            const headers = markdown_syntax.headings.repeat(3);
            replace_selection_text(headers, preprend_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text to be the head heading (Ctrl + 4)
        else if (event.keyCode === "4".codePointAt(0)) {
            event.preventDefault();
            const headers = markdown_syntax.headings.repeat(4);
            replace_selection_text(headers, preprend_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text to be the head heading (Ctrl + 5)
        else if (event.keyCode === "5".codePointAt(0)) {
            event.preventDefault();
            const headers = markdown_syntax.headings.repeat(5);
            replace_selection_text(headers, preprend_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text to be the head heading (Ctrl + 6)
        else if (event.keyCode === "6".codePointAt(0)) {
            event.preventDefault();
            const headers = markdown_syntax.headings.repeat(6);
            replace_selection_text(headers, preprend_text);
            markdown_text_box.dispatchEvent(input_event);
        }
        // making the text to be a prerendered text
        else if (event.keyCode === "P".codePointAt(0) || event.keyCode === "p".codePointAt(0)) {
            event.preventDefault();
            replace_selection_text(markdown_syntax.prerendered, surround_text);
            markdown_text_box.dispatchEvent(input_event);
        }
    }
});
