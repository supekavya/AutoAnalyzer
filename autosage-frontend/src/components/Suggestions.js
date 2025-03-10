// src/components/Suggestions.js

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Suggestions.css';
const API_KEY = process.env.REACT_APP_API_KEY;


const Suggestions = () => {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Add error state

    // Use environment variable for API key
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null); // Reset error state
        try {
            // Use backticks for template literals
            const prompt = `Suggest automobiles based on the keyword, provide real-time insights on two-wheelers and four-wheelers.
Your goal is to help users compare vehicle specifications, prices, features, and expert reviews.
Ensure responses are accurate, concise, and based on the latest automobile trends.
If a user asks for a vehicle comparison, generate a structured comparison table.
If real-time data is unavailable, offer the most recent insights and suggest reliable sources.
Use simple language for general users but provide technical details when requested.Do not answer any question that is outside your area of expertise.Talk to them, not to me.Directly start with the answer, do not repeat yourself with your work: ${search}`;
            const result = await model.generateContent(prompt);
            const responseText = result.response.text(); // Adjust based on actual response structure
            
            // Format text: Make **word** bold & replace * with new lines
            const formattedText = responseText
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Convert **word** → <b>word</b>
    .replace(/[\*\.;]/g, "<br/>"); // Convert *, ;, and . to new lines

            setSuggestions(formattedText.split('<br/>').filter(line => line.trim() !== "")); // Ensure empty lines are removed
        } catch (err) {
            console.error("Error fetching suggestions:", err);
            setError("Failed to fetch suggestions. Please check your API key and model availability."); // More specific error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="title">AutoSage</h1>
<h2 className="tagline">Smarter Choices, Smoother Rides.</h2>

            <input 
                type="text" 
                value={search} 
                onChange={handleChange} 
                placeholder="Search for automobiles..." 
            />
            <button onClick={handleSearch}>Search</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: suggestion }}></li> 
                ))}
            </ul>
        </div>
    );
};

export default Suggestions;
