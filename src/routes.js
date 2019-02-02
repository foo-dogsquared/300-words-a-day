const {app_configuration} = require("./app_constants");
const home_router = require("express").Router();

home_router.get(app_configuration.app_routes.home, function(req, res, next) {
    res.render("layout/home", {
        title: `${app_configuration.app_name} | ${app_configuration.app_description}`,
        replace_title: true,
        app_configuration
    })
})

home_router.get(app_configuration.app_routes.app, function(req, res, next) {
    res.render("layout/app", {
        title: `App`,
        app_configuration
    })
})

home_router.get(app_configuration.app_routes.settings, function(req, res, next) {
    res.render("layout/settings", {
        title: `Settings`,
        app_configuration
    })
});

home_router.get(app_configuration.app_routes.error, function(req, res, next) {
    res.render("layout/error", {
        title: `Whoops!`,
        app_configuration
    })
})

module.exports = home_router;
