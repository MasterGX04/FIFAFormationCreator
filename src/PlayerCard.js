import React, { useState, useEffect, useCallback } from 'react';
import '@szhsin/react-menu/dist/index.css';

const PlayerCard = ({ player }) => {
    const [playerStats, setPlayerStats] = useState([]);

    useEffect(() => {
        const positions = player.position.split(";");
        player.mainPosition = positions[0];
    }, [player.position]);

    useEffect(() => {
        let statsToAdd = [];
        if (player.mainPosition === "GK") {
            statsToAdd = [
                { posName: "DIV", stat: player.gkDiving },
                { posName: "HAN", stat: player.gkHandling },
                { posName: "KIC", stat: player.gkKicking },
                { posName: "REF", stat: player.gkReflex },
                { posName: "SPD", stat: player.gkSpeed },
                { posName: "POS", stat: player.gkPos }
            ];
        } else {
            statsToAdd = [
                { posName: "PAC", stat: player.pace },
                { posName: "SHO", stat: player.shooting },
                { posName: "PAS", stat: player.passing },
                { posName: "DRI", stat: player.dribbling },
                { posName: "DEF", stat: player.defending },
                { posName: "PHY", stat: player.physical }
            ];
        }

        setPlayerStats(statsToAdd);
    }, [player.mainPosition]);

    return (
        <div className="player-card">
            <div className="left-panel">
                <div className="player-info">
                    <h2>{player.overall}</h2>
                    <h3><span dangerouslySetInnerHTML={{ __html: player.mainPosition }} /></h3>
                    <img src={player.clubLogo} alt="Club Logo" className="club-logo" />
                    <img src={player.flag} alt="Country Flag" className="country-flag" />
                </div>

            </div>
            <div className="right-panel">
                <img src={player.photo} alt={player.name} className="player-photo" />
                <h3>{player.name}</h3>

                <div className="attribute-group">
                    <div className="attribute-section">
                        {playerStats.slice(0, 3).map((stat, index) => (
                            <div className="attribute-column" key={index}>
                                <div className="attribute-name">{stat.posName}</div>
                                <div className="attribute-value">{stat.stat}</div>
                            </div>
                        ))}
                    </div>
                    <div className="attribute-section">
                        {/* Map the last three stats */}
                        {playerStats.slice(3).map((stat, index) => (
                            <div className="attribute-column" key={index}>
                                <div className="attribute-name">{stat.posName}</div>
                                <div className="attribute-value">{stat.stat}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default PlayerCard;