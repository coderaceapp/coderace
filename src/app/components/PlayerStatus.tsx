import React from 'react';

interface PlayerStatusProps {
    connectedPlayers: boolean[];  // Array representing the connection status of players
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ connectedPlayers }) => {
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <div
                style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: connectedPlayers[0] ? '#4CAF50' : '#FF5722',
                }}
            ></div>
            <div
                style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: connectedPlayers[1] ? '#4CAF50' : '#FF5722',
                }}
            ></div>
        </div>
    );
};

export default PlayerStatus;