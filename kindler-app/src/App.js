// src/App.js - UPDATED TO USE BACKEND API

import React, { useState, useEffect } from 'react'; // Added useEffect
import ProjectCard from './components/ProjectCard';
import ProjectForm from './components/ProjectForm';
import './App.css'; 

const API_URL = 'https://kindler-gl2q.onrender.com/api/projects'; // Define API URL

function App() {
    // 1. STATE: Updated to manage loading state and errors
    const [allProjects, setAllProjects] = useState([]);
    const [projectIndex, setProjectIndex] = useState(0);
    const [matches, setMatches] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New state for loading

    // 2. Fetch Data (Replaces initialMockProjects)
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAllProjects(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                // In a real scenario, you'd show an error message to the user
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []); // Runs once on component mount

    const currentProject = allProjects[projectIndex];

    // 3. FUNCTION to Add a New Project (Sends data to backend)
    const handleAddProject = async (newProject) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProject),
            });

            if (!response.ok) {
                throw new Error('Failed to add project to database');
            }

            const addedProject = await response.json();
            
            // Add the newly saved project to the beginning of the list
            setAllProjects(prevProjects => [addedProject, ...prevProjects]);
            setShowForm(false); 
            alert(`Project "${addedProject.title}" successfully added!`);

        } catch (error) {
            console.error("Error adding project:", error);
            alert("Failed to add project. Check console for details.");
        }
    };

    // 4. CORE SWIPE FUNCTIONALITY (Simple update to index)
    const handleSwipe = (projectId, action) => {
        const project = allProjects.find(p => project._id === projectId); // Note: using _id from MongoDB

        if (action === 'KINDLE') {
            setMatches(prevMatches => [...prevMatches, project]);
            console.log(`Matched with: ${project.title}`);
            // FUTURE: Send match data to backend here
        } else {
            console.log(`Passed on: ${project.title}`);
            // FUTURE: Send pass data to backend here
        }

        setProjectIndex(prevIndex => prevIndex + 1);
    };

    // 5. RENDER LOGIC
    if (isLoading) {
        return <div className="App"><h2>Loading projects from server...</h2></div>;
    }

    return (
        <div className="App">
            <h1>Kindler 🔥 (Tinder for Projects)</h1>
            
            <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Submission Form' : 'Submit a New Project'}
            </button>
            
            {showForm && <ProjectForm onAddProject={handleAddProject} />}

            <div className="feed-container">
                {currentProject ? (
                    <ProjectCard 
                        project={currentProject} 
                        onSwipe={handleSwipe} 
                    />
                ) : (
                    <div className="no-projects">
                        <h2>🎉 All projects loaded!</h2>
                        <p>Total projects in database: {allProjects.length}. Submit a new one!</p>
                    </div>
                )}
            </div>
            
            <div className="matches-container">
                <h2>🤝 Your Matches ({matches.length})</h2>
                {matches.length > 0 ? (
                    <ul className="match-list">
                        {matches.map((match) => (
                            <li key={match._id}>
                                **{match.title}** (Owner: {match.owner})
                                <span className="contact-note"> - Simulated Contact Ready!</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Swipe right (Kindle) on a project to see it here!</p>
                )}
            </div>
        </div>
    );
}

export default App;