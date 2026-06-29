import path from "node:path";
import express from "express";
const __dirname = import.meta.dirname;
import indexRouter from "./routes/indexRouter.js";
import genreRouter from "./routes/genreRouter.js";

const app = express();
app.disable("x-powered-by"); // No reason to disclose

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// If relevant
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.redirect("/genres"));
app.use("/genres", genreRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on port ${PORT}`);
});