const app = require("./src/app");
const app_constants = require("./src/app_constants");

const port = process.env.PORT || 7777;

const server = app.listen(port, function() {
    const opened_port = server.address().port;

    console.log(`Server opened at port ${opened_port}.`);
});
