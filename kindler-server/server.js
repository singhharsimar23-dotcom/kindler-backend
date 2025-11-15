const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. App Setup
const app = express();
const PORT = 5000; // The backend will run on port 5000

// ======================================================================
// ⚠️ CORS FIX: ALLOWING YOUR VERCEL FRONTEND
// This is the fix to allow 'https://kindler.vercel.app' to connect to Render
// ======================================================================
app.use(cors({
    origin: 'https://kindler.vercel.app', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
})); 

// Middleware: Allows the app to read JSON data from the body of POST/PUT requests
app.use(express.json()); 

// 2. Database Connection
// Now using the DB_URI from Render's Environment Variables (process.env)
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/kindlerDB';

mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB connection successful.'))
    .catch(err => console.error('MongoDB connection error:', err));


// 3. Define a Simple Project Schema (Model)
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    owner: { type: String, default: 'Kindler User' },
    skillsNeeded: [String],
    goal: String,
    description: String,
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