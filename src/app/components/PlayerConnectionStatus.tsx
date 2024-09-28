import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';  // Import ThemeContext


interface PlayerConnectionStatusProps {
    mode: "multiplayer" | "single";
    isConnected: boolean;
    ws: WebSocket | null;
    roomCode: string;
    playerCount: number;
    onStartMatch: () => void;
}

const PlayerConnectionStatus: React.FC<PlayerConnectionStatusProps> = ({
    mode,
    isConnected,
    ws,
    roomCode,
    playerCount,
    onStartMatch,
}) => {
    const [playerReady, setPlayerReady] = useState(false);
    const [opponentReady, setOpponentReady] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayerCount, setCurrentPlayerCount] = useState<number>(playerCount);

    const themeContext = useContext(ThemeContext);

    // Safety check to ensure ThemeContext is defined
    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    // Handle player clicking "Start"
    const handleStartClick = () => {
        setPlayerReady(true);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'playerReady', roomCode }));
        }
    };

    // Listen for WebSocket messages
    useEffect(() => {
        if (ws) {
            const handleWebSocketMessage = (message: MessageEvent) => {
                const data = JSON.parse(message.data);

                if (data.type === 'opponentReady') {
                    setOpponentReady(true);
                }

                if (data.type === 'matchStarted') {
                    setGameStarted(true);
                    onStartMatch();
                }

                // Update player count when receiving `playerCountUpdate`
                if (data.type === 'playerCountUpdate') {
                    setCurrentPlayerCount(data.playerCount);
                    console.log(`Current number of players in room: ${data.playerCount}`);
                }
            };

            ws.addEventListener('message', handleWebSocketMessage);

            return () => {
                ws.removeEventListener('message', handleWebSocketMessage);
            };
        }
    }, [ws, onStartMatch]);

    return (
        <div
            className="player-status-container"
            style={{
                backgroundColor: colors.background,  // Use background color from theme
                padding: "20px",
                borderRadius: "10px",
                //color: colors.text,  // Use text color from theme
                textAlign: "center",
                fontFamily: "JetBrains Mono, monospace",
            }}
        >
            {/* Display status message */}
            <div
                style={{
                    marginBottom: "15px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    background: `linear-gradient(90deg, ${colors.buttonTextRun}, ${colors.buttonTextSubmit})`,  // Dynamic gradient based on theme
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}
            >
                {gameStarted ? (
                    <div>Game has started!</div>
                ) : (
                    currentPlayerCount === 2 ? (
                        playerReady ? (
                            opponentReady ? "Both players are ready! Starting game..." : "Waiting for opponent..."
                        ) : (
                            "Both players connected!"
                        )
                    ) : (
                        "Waiting for another player to join..."
                    )
                )}
            </div>

            {/* Show Start button only if 2 players are connected */}
            {currentPlayerCount === 2 && !gameStarted && (
                <button
                    onClick={handleStartClick}
                    disabled={playerReady}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: playerReady ? colors.background : colors.buttonBackground,  // Dynamic button background
                        color: colors.text,  // Use text color from theme
                        border: "none",
                        borderRadius: "10px",
                        cursor: playerReady ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        transition: "background-color 0.3s ease",
                    }}
                >
                    {playerReady ? "Waiting for opponent..." : "Start"}
                </button>
            )}
        </div>
    );
};

export default PlayerConnectionStatus;