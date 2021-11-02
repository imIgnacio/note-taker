const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const app = express();

const PORT = process.env.port || 3001;
const readFromFile = util.promisify(fs.readFile);

// APP use
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.static('public'));

// GET
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
    console.info(`${req.method} request received for tips`);
});

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json')
    .then((data) => {
        res.send(JSON.parse(data));
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

// POST
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if(!title && !text) {
        res.json('Error in posting note');
    }else{
        const newNote = {
            title,
            text,
        }

        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully 🚀');
    }
})

function readAndAppend(note, file) {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err){
            console.log(err);
        }else{
            const parsedData = JSON.parse(data);
            parsedData.push(note);
            writeToFile(file, parsedData);
        }
    })
}

function writeToFile(destination, data) {
    fs.writeFile(destination, JSON.stringify(data, null, 4), (err) => {
        err ? console.log(err) : console.info(`\nData written to ${destination}`);
    });
}