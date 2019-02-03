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

function autosave() {
    console.log("Autosaving content...");
    localforage.setItem(current_date.toDateString(), markdown_text_box.innerText);
}

localforage.getItem(APP_AUTOSAVE_SETTING)
    .then(function(value) {
        if (!value) setInterval(autosave, APP_AUTOSAVE_INTERVAL_DEFAULT_VALUE);
        else setInterval(autosave, value);
    })
    .catch(function(error) {
        console.error(error);
    })

localforage.getItem(current_date.toDateString())
    .then(function(value) {
        if (!value) return;
        else {
            markdown_text_box.innerText = value;
            markdown_preview_box.innerHTML = marked(value);
            const input_event = new Event("input");
            markdown_text_box.dispatchEvent(input_event);
        }
    })
    .catch(function(error) {
        console.error(error);
    })
