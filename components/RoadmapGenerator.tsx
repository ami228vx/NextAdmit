import React, { useState } from 'react';

const RoadmapGenerator = () => {
    const [profile, setProfile] = useState({
        name: '',
        academicBackground: '',
        targetUniversities: [],
        desiredPrograms: '',
    });

    const [roadmap, setRoadmap] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock roadmap generation logic
        const generatedRoadmap = `To apply to ${profile.targetUniversities.join(', ')}, consider the following steps based on your background in ${profile.academicBackground} and your desired programs: ${profile.desiredPrograms}.`;
        setRoadmap(generatedRoadmap);
    };

    return (
        <div>
            <h1>University Admission Roadmap Generator</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Your Name" value={profile.name} onChange={handleChange} required />
                <textarea name="academicBackground" placeholder="Your Academic Background" value={profile.academicBackground} onChange={handleChange} required></textarea>
                <input type="text" name="targetUniversities" placeholder="Target Universities (comma separated)" value={profile.targetUniversities} onChange={handleChange} required />
                <input type="text" name="desiredPrograms" placeholder="Desired Programs" value={profile.desiredPrograms} onChange={handleChange} required />
                <button type="submit">Generate Roadmap</button>
            </form>
            {roadmap && <div><h2>Your Personalized Roadmap:</h2><p>{roadmap}</p></div>}
        </div>
    );
};

export default RoadmapGenerator;