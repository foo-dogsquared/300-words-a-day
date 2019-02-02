function render_date() {
    const date_container = document.querySelector("#current-date");

    date_container.textContent = new Date().toDateString();
}