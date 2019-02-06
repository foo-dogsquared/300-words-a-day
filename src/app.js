const express = require("express");
const pug = require("pug");
const app_constants = require("./app_constants");
const app_routes = require("./routes");
const path = require("path");
const logger = require("morgan");

const app = express();

app
    .set("view engine", "pug")
    .set("views", path.join(__dirname, "views"))
    .use(express.static(path.join(__dirname, "../public")))
    .use(logger("dev"))
    .use(app_constants.app_configuration.app_routes.home, app_routes)
    .use("*", function(req, res, next){
        res.status(404).render("layout/error", {
            title: res.statusCode,
            app_configuration: app_constants.app_configuration,
            res
        });
    });

module.exports = app;
