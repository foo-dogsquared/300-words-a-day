const express = require("express");
const pug = require("pug");
const app_constants = require("./app_constants");
const app_routes = require("./routes");
const path = require("path");
// if the production env is on heroku
const is_prod_env_heroku = process.env.PRODUCTION_ENV;

// apps deployed on Heroku have their source files stored in https://<HEROKU_APP_LINK>/app/
// which is why they're somewhat necessary
console.log(process.cwd());
const public_dir = (is_prod_env_heroku) ? "../../public" : "../public";

const app = express();

app
    .set("view engine", "pug")
    .set("views", path.join(__dirname, "views"))
    .use(express.static(path.join(__dirname, "../public")))
    .use(app_constants.app_configuration.app_routes.home, app_routes)
    .use("*", function(req, res, next){
        res.status(404).render("layout/error", {
            title: res.statusCode,
            app_configuration: app_constants.app_configuration,
            res
        });
    });

module.exports = app;
