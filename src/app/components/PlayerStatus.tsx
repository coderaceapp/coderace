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
                    backgroundColor: connectedPlayers[0] ? 'green' : 'green',
                }}
            ></div>
            <div
                style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: connectedPlayers[1] ? 'green' : 'green',
                }}
            ></div>
        </div>
    );
};

export default PlayerStatus;