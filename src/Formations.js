import React, { useEffect } from 'react';
import './Formations.css';
import './App.css';
import PlayerCardMini from './PlayerCardMini';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

const Position = ({ position, modifiedPosition, player, highlightedPosition, setHighlightedPosition, removePlayer, switchPlayer }) => {
  const isHighlighted = position === highlightedPosition;

  const handleDoubleClick = () => {
    if (highlightedPosition === position) {
      setHighlightedPosition(null);
    } else {
      setHighlightedPosition(position);
    }

    console.log(highlightedPosition);
  }

  const handleSwitch = () => {
    if (highlightedPosition && position) {
      switchPlayer(position, highlightedPosition);
      setHighlightedPosition(null);
      console.log("Players switched!");
    }
  }

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.PLAYER,
    drop: (item) => {
      if (item.currentPosition !== position) {
        switchPlayer(item.currentPosition, position);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const positionParts = modifiedPosition.split('-');
  const positionName = positionParts[0];
  return (
    <div ref={drop} className={`position ${isHighlighted ? 'highlight' : ''} ${isHighlighted ? 'highlight' : ''}`}
      onDoubleClick={() => handleDoubleClick()}>
      {player ? <PlayerCardMini
        player={player}
        removePlayer={removePlayer}
        position={position}
        handleSwitch={handleSwitch}
        highlightedPosition={highlightedPosition}
        isQueue={false}
      /> :
        <div className="position-label">{positionName}</div>}
    </div>
  )
}

const Formations = ({ formation, positions, setPositionNames, highlightedPosition, setHighlightedPosition, setPositions, clearPositions, findBestPlayers }) => {
  const generateSpecficName = (index, numPositions, positionType) => {
    if (numPositions === 3) {
      if (index === 0) {
        return `LC` + positionType;
      } else if (index === 1) {
        return `C` + positionType;
      } else {
        return `RC` + positionType;
      }
    } else if (numPositions >= 4) {
      if (index === 0) {
        return `L` + positionType;
      } else if (index === numPositions - 1) {
        return `R` + positionType;
      } else {
        const middlePosition = numPositions - 2;
        const middleIndex = Math.floor(middlePosition / 2);
        if (middlePosition % 2 === 0) {
          if (index === middleIndex) {
            return `LC` + positionType;
          } else if (index === middleIndex + 1) {
            return `RC` + positionType;
          }
        } else {
          if (index === middleIndex) {
            return `LC` + positionType;
          } else if (index === middleIndex + 1) {
            return `C` + positionType;
          } else if (index === middleIndex + 2) {
            return `RC` + positionType;
          }
        }
      }
    }
  }

  /**
   * Determines name of position with left and  right for edge positions
   * and centers for others
   * @param positionType position to be displayed
   * @param index chooses which specific position within overall position (ie Forward, Midfielders, etc.)
   */
  const generatePositionName = (positionType, index) => {
    let positionName = '';

    switch (positionType) {
      case 'Defender':
        positionName = generateSpecficName(index, formation.defenders, 'B');
        break;

      case 'dMidfielder':
        if (index === 0 && formation.dMidfielders > 1) {
          positionName = 'LDM';
        } else if (index === formation.dMidfielders - 1 && formation.dMidfielders > 1) {
          positionName = 'RDM';
        } else {
          positionName = 'CDM';
        }
        break;

      case 'Midfielder':
        if (formation.midfielders > 2) {
          positionName = generateSpecficName(index, formation.midfielders, 'M');
        } else {
          if (index === 0) {
            positionName = 'LM';
          } else {
            positionName = 'RM';
          }
        }
        break;

      case 'aMidfielder':
        if (index === 0 && formation.aMidfielders > 1) {
          positionName = 'LAM';
        } else if (index === formation.aMidfielders - 1 && formation.aMidfielders > 1) {
          positionName = 'RAM';
        } else {
          positionName = 'CAM';
        }
        break;

      case 'Striker':
        //Checks if 4-3-3 formation
        if (formation.strikers === 3) {
          if (index === 0) {
            positionName = 'LW';
          } else if (index === 2) {
            positionName = 'RW';
          } else {
            positionName = 'ST';
          }
        } else if (index === 0 && formation.strikers > 1) {
          positionName = 'LS';
        } else if (index === formation.strikers - 1 && formation.strikers > 1) {
          positionName = 'RS';
        } else {
          positionName = 'ST';
        }
        break;

      default:
        positionName = 'GK';
        break;
    }

    return { originalName: positionType + '-' + index, modifiedName: positionName };
  }


  const generatePositions = (positionType, numPlayers) => {
    return Array.from({ length: numPlayers }, (_, index) => {
      const { originalName, modifiedName } = generatePositionName(positionType, index, numPlayers);
      const positionKey = `${positionType}-${index}`;
      return <Position
        key={positionKey}
        position={originalName}
        modifiedPosition={modifiedName}
        player={positions[positionKey]}
        highlightedPosition={highlightedPosition}
        setHighlightedPosition={setHighlightedPosition}
        removePlayer={() => removePlayer(positionKey)}
        switchPlayer={switchPlayer}
      />;
    });
  };

  // Function to remove player from a position
  const removePlayer = (position) => {
    setPositions(prevPositions => ({
      ...prevPositions,
      [position]: null // Remove player from position
    }));
  };

  const switchPlayer = (sourcePosition, targetPosition) => {
    let sourcePlayer = positions[sourcePosition];
    let targetPlayer = positions[targetPosition];
  
    // If both source and target are non-null, swap them including currentPosition updates.
    if (sourcePlayer && targetPlayer) {
      const tempPosition = sourcePlayer.currentPosition;
      sourcePlayer.currentPosition = targetPlayer.currentPosition;
      targetPlayer.currentPosition = tempPosition;
    } else if (sourcePlayer && !targetPlayer) {
      // If only source has a player, move it to target and update currentPosition.
      sourcePlayer.currentPosition = targetPosition;
    } else if (!sourcePlayer && targetPlayer) {
      // If only target has a player, move it to source and update currentPosition.
      targetPlayer.currentPosition = sourcePosition;
    }
  
    // Prepare the new positions object for updating state
    const newPositions = { ...positions };
  
    // Update positions in the newPositions object
    if (sourcePlayer && targetPlayer) {
      // Both players exist, swap them in the newPositions object
      newPositions[sourcePosition] = targetPlayer;
      newPositions[targetPosition] = sourcePlayer;
    } else if (sourcePlayer && !targetPlayer) {
      // Only sourcePlayer exists, move to targetPosition and clear sourcePosition
      newPositions[targetPosition] = sourcePlayer;
      newPositions[sourcePosition] = null; // or however you represent an empty position
    } else if (!sourcePlayer && targetPlayer) {
      // Only targetPlayer exists, move to sourcePosition and clear targetPosition
      newPositions[sourcePosition] = targetPlayer;
      newPositions[targetPosition] = null; // or however you represent an empty position
    }
  
    // Update the state with the new positions
    setPositions(newPositions);
  };

  const positionGroups = [
    { type: 'Striker', positions: generatePositions('Striker', formation.strikers) },
    { type: 'aMidfielder', positions: generatePositions('aMidfielder', formation.aMidfielders) },
    { type: 'Midfielder', positions: generatePositions('Midfielder', formation.midfielders) },
    { type: 'dMidfielder', positions: generatePositions('dMidfielder', formation.dMidfielders) },
    { type: 'Defender', positions: generatePositions('Defender', formation.defenders) },
    { type: 'Goalkeeper', positions: generatePositions('Goalkeeper', 1) } // Assuming generatePositions can handle the goalkeeper as a special case
  ];

  useEffect(() => {
    const allPositionNames = positionGroups.flatMap(group =>
      group.positions.map(child => child.props.modifiedPosition)
    );
    setPositionNames(allPositionNames);
    clearPositions();
    findBestPlayers(allPositionNames);
  }, [formation]);



  return (
    <div className="soccer-field">
      <div className="positions-container">
        {positionGroups.map(group => (
          <div className="positions-section" key={group.type}>
            {group.positions}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Formations;