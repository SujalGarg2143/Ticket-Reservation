import express from "express";
import fs from "fs";
import path from "path";
// import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

app.set('view engine', 'ejs');

const movies = JSON.parse(fs.readFileSync("./data/movies.json"), "utf8");

app.get('/', (_, res) => {
    res.render('home', { movies: Object.keys(movies) });
});

app.get('/movie/:id', (req, res) => {
    const movie = movies[req.params.id.replace(/%20/g, " ")];
    if (movie) {
        res.render('movie', { movie });
    } else {
        res.status(404).send('Movie not found');
    }
});

app.get('/book/:id', (req, res) => {
    const movie = movies[req.params.id.replace(/%20/g, " ")];
    console.log(req.params.id.replace(/%20/g, " "))
    if (movie) {

        res.render('book', { movie });

    } else {
        res.status(404).send('Movie not found');
    }
});

app.post("/pay", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    console.log(`Payment initiated for ${email}`);
    res.json({ message: "Payment successful!" });
});

// const usersFilePath = path.join("./data", "users.json");
// if (!fs.existsSync(usersFilePath)) {
//     fs.writeFileSync(usersFilePath, JSON.stringify([]));
// }

app.get("/login", (req, res) => res.render("login"));
app.use("/api/auth", authRoutes);  // ✅ Ensure this is correct!




// app.post('/signup', (req, res) => {
//     const { name, email, password } = req.body;

//     const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

//     if (users.find(user => user.email === email)) {
//         return res.send("User already exists! Try logging in.");
//     }

//     users.push({ name, email, password });
//     fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

//     res.redirect("/"); 
// });

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
