const express = require("express");
const path = require("path");
const indexRoute = require("./routes/indexRoute");
// const logger = require("morgan");
const app = express();

app.set("views", path.join(__dirname, "views")); // Set the views directory
app.set("view engine", "hbs"); // Set the view engine to handlebars
app.use(logger("dev"));

// Expose all of the files in the public directory as static assets which the browser can request.
// For example, for the file public/stylesheets/style.css, the browser can request /stylesheets/style.css.
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the indexRoute for all requests to the root URL
app.use("/", indexRoute);

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send("404: Page not found");
});

// Handle 500 errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("500: Internal server error");
});

// Start the server
const port = 3030;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
