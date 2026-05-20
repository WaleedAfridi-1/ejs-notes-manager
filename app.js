const express = require('express');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const cards = []

app.get("/", (req, res) => {
    fs.readdir("./files", (err, files) => {
        res.render("home", { files: files })
    })
})

app.post("/create", (req, res) => {
    const title = req.body.title
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
    const fileName = title
        .join("-")
        .trim()
        .replace("/\s+/", "_")
        
    fs.writeFile(`./files/${fileName}.txt`, req.body.description, (err) => {
        if (err) {
            console.log(err);
            return;
        }
    })
    res.redirect('/')
})

app.get(`/file/:filename`, (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        } else {
            res.render('show', {
                filename: req.params.filename.replace(".txt", ""),
                filedata: data
            })
        }
    })
})




app.listen(3000, () => {
    console.log("Server is running on http//:localhost:3000")
})