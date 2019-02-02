const markdown_text_container = document.querySelector("#markdown-editor");
const number_of_words_container = document.querySelector(".number-of-words");
const number_of_characters_container = document.querySelector(".number-of-characters");

markdown_text_container.addEventListener("input", function(event) {
    const editor_content = markdown_text_container.innerText;
    if (!editor_content) {
        number_of_words_container.textContent = `no words`;
        number_of_characters_container.textContent = `no characters`;
        event.preventDefault();
    }
    else {
        const editor_word_length = editor_content.match(/\S+/g).length;
        const editor_characters_length = editor_content.length;
        number_of_words_container.textContent = `${editor_word_length} word${(editor_word_length === 1) ? "" : "s"}`;
        number_of_characters_container.textContent = `${editor_characters_length} character${(editor_characters_length === 1) ? "" : "s"}`;
    }
});
