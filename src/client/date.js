function render_date(date_container = document.querySelector("#current-date")) {
    date_container.textContent = new Date().toDateString();
}

render_date();