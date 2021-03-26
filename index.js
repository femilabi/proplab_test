const express = require("express");
const app = express();
const http = require("http").Server(app);
const cookieParser = require("cookie-parser");
const glob = require("glob");
const path = require("path");

const { checkAuth } = require("./middlewares/auth");
const responseHandler = require("./middlewares/responseHandler");

const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ limit: "500kb", extended: false }));
app.use(cookieParser());

// AUTHENTICATION MIDDLEWARE
app.use(checkAuth);

// AUTOMATICALLY REQUIRE ALL CONTROLLERS
glob.sync("./controllers/*.js").forEach(function (file) {
    let controller = path.parse(file)["name"];
    app.use("/" + controller, require(path.resolve(file)));
});

// 404 ERROR HANDLER
app.use((req, res) => {
    const response = new responseHandler(req, res);
    return response
        .setMsg("Invalid request", "error")
        .send();
});

// SERVER PORT IMPLEMENTATION
http.listen(PORT, () => {
   console.log("Server is running on port ", PORT);
});