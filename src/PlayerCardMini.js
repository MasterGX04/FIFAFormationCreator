import React, { useState } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import './PlayerCardMini.css';
import PlayerStatsPopup from './StatsPopup';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

/**
     * @param {*player} player to be removed
     * @param {*function} onRemovePlayer prop to from App to handle removing player
     */
const PlayerCardMini = ({ player, removePlayer, index, position, handleSwitch, highlightedPosition, isQueue }) => {
    const [statsPopupOpen, setStatsPopupOpen] = useState(false);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.PLAYER,
        item: { 
            type: ItemTypes.PLAYER,
            currentPosition: player.currentPosition,
            name: player.name,
         },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const getPosition = () => {
        if (player.position.includes(";")) {
            const positions = player.position.split(";");
            return positions[0];
        }

        return player.position;
    }

    const [menuState, setMenuState] = useState({ isOpen: false, x: 0, y: 0 });
    const handleContextMenu = (e) => {
        e.preventDefault();
        const { pageX, pageY } = e;

        const newMenuState = { isOpen: !menuState.isOpen, x: pageX, y: pageY };
        setMenuState(newMenuState);
    };

    const handleCloseMenu = () => {
        setMenuState({ ...menuState, isOpen: false, x: 0, y: 0 });
    }

    const canSwitch = highlightedPosition && highlightedPosition !== position;

    const getLastName = (fullname) => {
        const parts = fullname.split(' ');
        if (parts.length === 1) {
            return fullname;
        }
        if (parts[1].length < 3) {
            return fullname;
        }
        parts.shift();
        return parts.join(' ');
    }

    //Toggles whether status window is shown
    const toggleStatsPopup = () => {
        setStatsPopupOpen(!statsPopupOpen);
    };

    return (
        <div
            className="player-card-mini"
            onContextMenu={handleContextMenu}
            ref={drag}
            style={{
                opacity: isDragging ? 1 : 1,
                cursor: 'grab',
            }}>
            <div className="left-panel">
                <div className="player-info">
                    <h2>{player.overall}</h2>
                    <h3><span dangerouslySetInnerHTML={{ __html: getPosition() }} /></h3>
                    <img src={player.clubLogo} alt="Club Logo" className="club-logo" />
                    <img src={player.flag} alt="Country Flag" className="country-flag" />
                </div>
            </div>
            <div className="right-panel">
                <img src={player.photo} alt={player.name} className="player-photo" />
                <p style={{ marginBottom: '15px' }}>{getLastName(player.name)}</p>
            </div>
            {menuState.isOpen && (
                <Menu
                    x={menuState.x}
                    y={menuState.y}
                    menuButton={<MenuButton style={{ marginLeft: '-50px', marginTop: '50px' }}>Edit</MenuButton>}
                    onClose={handleCloseMenu}>
                    <MenuItem
                        onClick={() => {
                            if (isQueue) {
                                console.log('Player being removed from queue at index: ', index);
                                removePlayer(index);

                            } else {
                                removePlayer(position);
                            }
                            handleCloseMenu(); // Optionally, you might want to close the menu here as well
                        }}
                    >
                        Remove Player
                    </MenuItem>
                    {!isQueue && <MenuItem onClick={() => { handleSwitch() }} disabled={!canSwitch}>Switch Player</MenuItem>}

                    <MenuItem onClick={toggleStatsPopup}>Show Stats Menu</MenuItem>
                    <MenuItem onClick={handleCloseMenu}>Exit</MenuItem>
                </Menu>
            )}
            {statsPopupOpen && <PlayerStatsPopup player={player} onClose={toggleStatsPopup} />}
        </div>
    );
}

export default PlayerCardMini;