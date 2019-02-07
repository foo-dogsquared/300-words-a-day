const note_container = document.querySelector(".notes-container");
const number_id_regex = new RegExp(self.origin + "/note/" + "(.+)");
const number_id_param = document.URL.match(number_id_regex)[1];
const notes_instance = localforage.createInstance({
    name: APP_DB_NAME,
    storeName: APP_NOTES_LOCATION_STRING
});
notes_instance.getItem(number_id_param)
.then(function(note_object) {
    const note_header = document.createElement("h1");
    console.log(note_object);
    if (!note_object) {
        note_header.textContent = `Found no such notes.`;
        note_container.appendChild(note_header);
    }
    else {
        note_header.textContent = note_object.date.toDateString();
        const note_content = document.createElement("p");
        note_content.innerHTML = marked(note_object.content);
        note_container.appendChild(note_header);
        note_container.appendChild(note_content);
    }
})
.catch(function(error) {
    console.error(error);
})
