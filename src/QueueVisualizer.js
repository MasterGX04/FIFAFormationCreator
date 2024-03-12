import React from 'react';
import PlayerCardMini from './PlayerCardMini.js';
import './QueueVisualizer.css';

const QueueVisualizer = ({ queue, removeFromQueue, clearQueue, findBestPosition, positionNames}) => {
    const chunks = queue.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 6);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);

    return (
        <div className="queue-visualizer">
            <h2>Player Queue (Add All 11 Players First)</h2>
            <div className="queue-container">
                {chunks.map((chunk, index) => (
                    <div key={index} className="queue-row"><div></div>
                        {chunk.map((player, playerIndex) => (
                            <PlayerCardMini 
                            key={playerIndex} 
                            player={player}
                            removePlayer={removeFromQueue}
                            index = {playerIndex + 6 * index}
                            isQueue={true}  />
                        ))}
                    </div>
                ))}
            </div>
            {queue.length === 11 && <button onClick={() => findBestPosition(positionNames, true)}>Find Best Positions</button>}
            <button onClick={clearQueue}>Clear Queue</button>
        </div>
    );
}

export default QueueVisualizer;