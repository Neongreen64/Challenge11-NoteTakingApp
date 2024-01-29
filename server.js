//require express, path, fs. and uuid
const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4:uuidv4} = require('uuid');
//declare app variable
const app = express();

//delcare port
const PORT = process.constrainedMemory.PORT || 3001;

//middleware for json
app.use(express.json());

//serve express.static
app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));

//route to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//api get route
app.get('/api/notes', (req, res) => {
    const note = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(note);
});

//api post route
app.post('/api/notes', (req,res) => {
    //declare noteNew
    const noteNew = req.body;

    //create previousNotes
    const previousNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    //generate id for noteNew
    noteNew.id = uuidv4();

    //push the new note to the previous notes
    previousNotes.push(noteNew);

    //write files to db.json
    fs.writeFileSync('./db/db.json', JSON.stringify(previousNotes), 'utf8');
    res.json(noteNew);
});

//api delete route
app.delete('/api/notes/:id', (req, res) => {
    //declare noteId
    const noteId = req.params.id;

    //create previousNotes
    const previousNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    //Find index of note
    const noteNum = previousNotes.findIndex(note => note.id === noteId);

    //delete note if found, otherwise return error note not found
    if (noteNum !== -1){
        const deletedNote = previousNotes.splice(noteNum, 1)[0];

        fs.writeFileSync('./db/db.json', JSON.stringify(previousNotes), 'utf8');

        res.json(deletedNote);
    }
    else{
        res.status(400).json({ error: 'Note not found'});
    }

    
});

//start app
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});