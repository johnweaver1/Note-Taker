const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const noteCreation = require('./db/db.json');
// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());


//getting all our routes!
app.get('/api/notes', (req, res) => {
    res.json(noteCreation.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//creating our notes
function createNewNote(body, nArray) {
    const newNote = body;
    if (!Array.isArray(nArray))
        nArray = [];
    
    if (nArray.length === 0)
        nArray.push(0);

    body.id = nArray[0];
    nArray[0]++;

    nArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(nArray, null, 2)
    );
    return newNote;
}

//posting the note
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, noteCreation);
    res.json(newNote);
});

//function for deleting the note
function deleteNote(id, nArray) {
    for (let i = 0; i < nArray.length; i++) {
        let note = nArray[i];

        if (note.id == id) {
            nArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(nArray, null, 2)
            );

            break;
        }
    }
}
//then actually deleting the note.
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, noteCreation);
    res.json(true);
});
//listening for connections!
app.listen(PORT, () => {
    console.info(`Example app listening at http://localhost:${PORT} 🚀`)
});
