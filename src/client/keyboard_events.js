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
