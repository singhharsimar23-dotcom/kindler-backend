// kindler-server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. App Setup
const app = express();
const PORT = 5000; // The backend will run on port 5000

// Middleware: Allows React frontend to talk to this server
app.use(cors()); 
// Middleware: Allows the app to read JSON data from the body of POST/PUT requests
app.use(express.json()); 

// 2. Database Connection (THIS IS TEMPORARY)
// NOTE: You will replace 'mongodb://localhost:27017/kindlerDB' 
//       with a real connection string from MongoDB Atlas later.
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/kindlerDB';

mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB connection successful.'))
    .catch(err => console.error('MongoDB connection error:', err));


// 3. Define a Simple Project Schema (Model)
// This tells MongoDB what a Project document looks like
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    owner: { type: String, default: 'Kindler User' },
    skillsNeeded: [String],
    goal: String,
    description: String,
    // In a real app, we'd add fields for swiping/matching here
});

const Project = mongoose.model('Project', ProjectSchema);


// 4. API Route - Get All Projects
app.get('/api/projects', async (req, res) => {
    try {
        // Fetch all projects from the database
        const projects = await Project.find(); 
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. API Route - Add a Project
app.post('/api/projects', async (req, res) => {
    // req.body contains the JSON data sent from the frontend form
    const project = new Project({
        title: req.body.title,
        owner: req.body.owner,
        skillsNeeded: req.body.skillsNeeded,
        goal: req.body.goal,
        description: req.body.description
    });

    try {
        const newProject = await project.save(); // Save to database
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// 6. Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API is ready!`);
});