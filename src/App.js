import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SearchBar from './SearchBar';
import PlayerCard from './PlayerCard';
import FormationDropdown from './FormationDropdown';
import Formations from './Formations';
import QueueVisualizer from './QueueVisualizer';
import './App.css';
import { getValue } from '@testing-library/user-event/dist/utils';

function App() {
  const options = [
    { value: '4-0-4-0-2', label: '4-4-2' },
    { value: '4-0-3-0-3', label: '4-3-3' },
    { value: '4-1-2-0-3', label: '4-3-3(2) ' },
    { value: '4-2-0-3-1', label: '4-2-3-1' },
    { value: '4-1-2-1-2', label: '4-1-2-1-2' },
    { value: '4-0-3-2-1', label: '4-3-2-1' },
    { value: '4-0-3-1-2', label: '4-3-1-2' },
    { value: '4-1-4-0-1', label: '4-1-4-1' },
    { value: '4-0-5-0-1', label: '4-5-1' },
    { value: '5-0-4-0-1', label: '5-4-1' },
    { value: '5-0-3-0-2', label: '5-3-2' },
    { value: '5-0-2-1-2', label: '5-2-1-2 ' },
    { value: '3-0-5-0-2', label: '3-5-2' },
    { value: '3-1-4-0-2', label: '3-1-4-2' },
    { value: '3-0-4-0-3', label: '3-4-3' },
    { value: '3-0-4-1-2', label: '3-4-1-2' },
    { value: '3-0-4-2-1', label: '3-4-2-1' },
  ];

  const getValueByLabel = (label) => {
    const option = options.find(option => option.label === label);
    return option.value;
  };

  const [searchResults, setSearchResults] = useState([]);
  const [formation, setFormation] = useState({ defenders: 4, dMidfielders: 0, midfielders: 4, aMidfielders: 0, strikers: 2 });
  const [dropFormation, setDropFormation] = useState('4-4-2');
  const [positions, setPositions] = useState([]);

  //Loads in a formation if there is a file saved in .json file in saved_formations
  useEffect(() => {
    loadPositionsFromServer();
  }, []);

  const loadPositionsFromServer = async () => {
    try {
      const response = await axios.get('http://localhost:80/load_positions.php', {
        withCredentials: true
      });
      console.log('Loaded data:', response.data);

      if (response.data) {
        const newQueue = response.data.queue;
        const positions = response.data.positionsData;
        const formation = response.data.dropFormation;

        setQueue(newQueue);
        setDropFormation(formation);

        const fullValue = getValueByLabel(formation);
        console.log('Option:', fullValue);

        handleFormationSelect(fullValue);
        setPositions(positions);
      }
    } catch (error) {
      console.error('Error loading positions:', error.message);
    }
  };


  // Function to save positions array to a JSON file
  const savePositionsToServer = async (positionsData) => {
    axios.post('http://localhost:80/save_positions.php', {
      queue,
      dropFormation,
      positionsData,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    })
      .then((response) => {
        console.log('Successful response:', response.data);
        alert('Positions have been saved!');
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  //Positions and formations parameters 
  const positionParams = {
    Defender: 'defenders',
    dMidfielder: 'dMidfielders',
    Midfielder: 'midfielders',
    aMidfielder: 'aMidfielders',
    Striker: 'strikers',
  };
  const [positionNames, setPositionNames] = useState(['LS', 'RS']);
  const [highlightedPosition, setHighlightedPosition] = useState(null);
  const [queue, setQueue] = useState([]);

  const addPlayerToPosition = (player) => {
    if (highlightedPosition) {
      const updatedPosition = { ...positions, [highlightedPosition]: player }
      player.currentPosition = highlightedPosition;
      setPositions(updatedPosition);
    }
  };

  const getPositionType = (positionName) => {
    if (positionName.includes('B')) return 'Defender';
    if (positionName.includes('CM') || positionName.includes('LM') || positionName.includes('RM')) return 'Midfielder';
    if (positionName.endsWith('AM')) return 'aMidfielder';
    if (positionName.includes('S') || positionName.includes('W')) return 'Striker';
    if (positionName.endsWith('DM')) return 'dMidfielder';
  }

  const handlePlayerClick = (player) => {
    if (highlightedPosition) {
      addPlayerToPosition(player, highlightedPosition);
      console.log('Player added to: ', highlightedPosition)
      setHighlightedPosition(null); // Reset selected position after adding the player
    } else {
      console.error("No position selected!");
    }
  };

  //Clears positions array
  const handleClear = () => {
    setPositions([]);
  }

  const handleFormationSelect = (selectedFormation) => {
    const [defenders, dMidfielders, midfielders, aMidfielders, strikers] = selectedFormation.split('-').map(Number);
    setFormation({ defenders, dMidfielders, midfielders, aMidfielders, strikers });
  };

  const handleSearch = (filteredPlayers) => {
    setSearchResults(filteredPlayers);
  };

  //Adds player to eleven player queue
  const addToQueue = (player) => {
    if (queue.length >= 11) {
      alert("You can only select up to eleven players.");
      return;
    }

    if (player.mainPosition === 'GK' && queue.some(p => p.mainPosition === 'GK')) {
      alert('You can only have one goalkeeper in the equeue.');
      return;
    }

    if (queue.find(p => p.fullName === player.fullName)) {
      alert('Player is already in the queue');
      return;
    }

    setQueue([...queue, player]);
    console.log(player.name + ' added to queue');
  };

  const removeFromQueue = (position) => {
    setQueue(prevQueue => {
      const updatedQueue = prevQueue.filter((player, index) => index !== position);
      return updatedQueue;
    });
  };

  const clearQueue = () => {
    if (queue.length > 0) {
      const userConfirm = window.confirm('Are you sure you want to delete this queue?');
      if (userConfirm) {
        setQueue([]);
      }
    }
  }

  //Finds the best position for each player
  const findPlayersForEachFormation = (positionNames, isCalled) => {
    if ((!positions || Object.values(positions).every(position => position === null) || queue.length !== 11) && !isCalled) {
      return '';
    }

    console.log('Positions Names: ', positionNames);

    const bestPlayers = {};
    let availablePlayers = [...queue];
    const filledPositions = {};

    // Initialize filledPositions with all position names set to false
    positionNames.forEach(position => {
      filledPositions[position] = false;
    });

    for (let i = 0; i < positionNames.length; i++) {
      const position = positionNames[i];
      // Iterate over player's stats and find the best available position
      const sortedPlayers = availablePlayers.sort((a, b) => {
        const statA = getStatForPosition(a, position);
        const statB = getStatForPosition(b, position);
        return statB - statA;
      }); //sortedPlayers
      //console.log('Sorted Players for ', position, ': ', sortedPlayers);

      // Find the first player that hasn't been assigned to a position
      if (sortedPlayers.length > 0) {
        const bestPlayer = sortedPlayers[0];
        bestPlayers[position] = bestPlayer;
        availablePlayers = availablePlayers.filter(player => player.name !== bestPlayer.name);
      }
    } //positionNames for

    console.log("Best Players ", bestPlayers);

    const updatedPositions = {}; // Create a copy of the positions object


    for (let i = 0; i < positionNames.length; i++) {
      const player = bestPlayers[positionNames[i]];
      const position = positionNames[i];

      if (positionNames.includes(position) && player) {
        //console.log('Current position:', positionNames[i]);
        if (position === 'GK') {
          updatedPositions['Goalkeeper-0'] = player;
        } else {
          const param = positionParams[getPositionType(position)]; //formation variable
          for (let j = 0; j < formation[param]; j++) {
            const positionKey = `${getPositionType(position)}-${j}`;
            if (!updatedPositions[positionKey]) {
              updatedPositions[positionKey] = player;
              player.currentPosition = positionKey;
              //console.log(player.name, 'has been added to', positionKey);
              break;
            }
          }
        }
      }
    }

    setPositions(updatedPositions); // Update the positions state
    console.log('Positions:', updatedPositions);
    return bestPlayers;
  };

  //Helper to get the stat value for a given position
  const getStatForPosition = (player, position) => {
    let score = 0;
    const posIndex = player.position.split(';').map(pos => pos.trim()).findIndex(pos => {
      //Case for if the current pos being checked is equal to positionName index
      if ((pos === position) || ((pos === 'ST' || pos === 'CF') && position.includes('S'))) {
        return true;
      }

      //Case for LW and RW being equivalent to Midfield positions
      if ((pos === 'RW' && (position === 'RAM' || position === 'RM')) || (pos === 'LW' && (position === 'LAM' || position === 'LM'))) {
        return true;
      }

      if ((pos === 'LAM' || pos === 'RAM') && position === 'CAM') {
        return false;
      }


      if (pos === 'CB' && position.endsWith('CB')) {
        return true;
      }

      // General case for other positions not related to defenders
      return ((pos === 'CM' && position.endsWith(pos)) || (pos === 'CDM' && position.endsWith('DM'))) && !pos.endsWith('B') && pos;
    });

    if (posIndex !== -1) {
      score += 1000; // Base score for any listed position
      // Define boosts for each position priority (1st, 2nd, 3rd, etc.)
      const boosts = [1.3, 1.2, 1.1]; // Define boosts for top 3 priorities
      const boost = boosts[posIndex] || 1; // Default boost is 1 if position is beyond the 3rd
      score *= boost;
    }

    if (player.hasOwnProperty(position)) {
      // Split stat by '+' to get baseform
      let stat = Number(player[position]);
      let form = 0;
      if (player[position].includes('+')) {
        [stat, form] = player[position].split('+').map(Number);
      } else if (player[position].includes('-')) {
        [stat, form] = player[position].split('-').map(Number);
      }
      score += stat + form;

      if (isFootPreferenceMatch(player, position)) {
        score += 10;
      }

      //console.log(player.name + ' Stat for ' + position + '->\nStat:', (stat + form), '\nFoot: ', isFootPreferenceMatch(player, position) ? 10 : 0, '\nTotal: ' + score);
      // Adds up stat and form even if there's no + sign
      return score;
    } else {
      return -1; // Return -1 if the player doesn't have the specified position
    }
  }

  // Helper to evaluate if the player's preferred foot matches the position's typical foot preference
  const isFootPreferenceMatch = (player, position) => {
    if (position.startsWith('R') && player.prefFoot === 'Left') return true;
    if (position.startsWith('L') && player.prefFoot === 'Right') return true;
    return false;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>FIFA Player Manager</h1>
        <QueueVisualizer
          queue={queue}
          removeFromQueue={removeFromQueue}
          clearQueue={clearQueue}
          findBestPosition={findPlayersForEachFormation}
          positionNames={positionNames} />
        <h1>Football Custom Formation</h1>
        <FormationDropdown
          dropFormation={dropFormation}
          setDropFormation={setDropFormation}
          options={options}
          handleFormationSelect={handleFormationSelect}
        />
        <button onClick={() => handleClear()}>Clear</button>
        {positions ? <button onClick={() => savePositionsToServer(positions)}>Save Formation</button> : ''}
        <Formations
          formation={formation}
          positions={positions}
          setPositions={setPositions}
          setPositionNames={setPositionNames}
          highlightedPosition={highlightedPosition}
          setHighlightedPosition={setHighlightedPosition}
          addPlayerToPosition={addPlayerToPosition}
          clearPositions={handleClear}
          findBestPlayers={findPlayersForEachFormation}
        />
        <h2>Add Players Here</h2>
        <SearchBar onSearch={handleSearch} />
        <div className="player-cards">
          <ul>
            {searchResults.map((player, index) => (
              <div key={index} className="player-card-container">
                <PlayerCard player={player} />
                {/* Add additional player information as needed */}
                <button onClick={() => handlePlayerClick(player)}>
                  Add to Formation
                </button>
                {/* Add To Queue Function */}
                <button
                  onClick={() => addToQueue(player)}
                  disabled={queue.length >= 11 || queue.some(p => p.fullName === player.fullName) || (player.mainPosition === 'GK' && queue.some(p => p.mainPosition === 'GK'))}
                >Add To Queue</button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
