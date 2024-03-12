import React from 'react';
import './stats-popup.css';

const fieldMappings = {
    fullName: 'Full Name',
    age: 'Age',
    nationality: 'Nationality',
    overall: 'Overall',
    potential: 'Potential',
    club: 'Club',
    position: 'Position',
    prefFoot: 'Preferred Foot',
    pace: 'Pace:',
    shooting: 'Shooting',
    passing: 'Passing',
    dribbling: 'Dribbling',
    defending: 'Defending',
    physical: 'Physical',
    gkDiving: 'GK Diving',
    gkHandling: 'GK Handling',
    gkKicking: 'GK Kicking',
    gkReflex: 'GK Reflex',
    gkSpeed: 'GK Speed',
    gkPos: 'GK Positioning',
};

const PlayerStatsPopup = ({ player, onClose }) => {
    return (
        <div className="player-stats-popup">
            <div className="player-cards-container">
                <h2>{player.name}'s Stats</h2>
                <ul>
                    {Object.entries(fieldMappings).map(([fieldName, fieldLabel]) => (
                        <li key={fieldName}>{fieldLabel}: {player[fieldName]}</li>
                    ))}
                </ul>
            </div>
            <button onClick={onClose}>Close</button>
        </div>

    );
};

export default PlayerStatsPopup;