//require express, path, and fs
const express = require('express');
const path = require('path');
const fs = require('fs');

//declare app variable
const app = express();

//delcare port
const PORT = process.constrainedMemory.PORT || 3001;

//middleware for json
app.use(express.json());

//serve express.static
app.use(express.static('public'));

//route to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//api get route
app.get('/api/notes', (req, res) => {
    const note = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    res.json(note);
});

//api post route
app.post('/api/notes', (req,res) => {
    //declare noteNew
    const noteNew = req.body;

    //read previous notes
    const previousNotes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    //generate id for noteNew
    noteNew.id = generateUniqueID();

    //push the new note to the previous notes
    previousNotes.push(noteNew);

    //write files to db.json
    fs.writeFileSync('db.json', JSON.stringify(previousNotes), 'utf8');
    res.json(noteNew);
});

//start app
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});