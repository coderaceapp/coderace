import { useState, useEffect } from "react";

export const useWebSocket = (
    mode: "multiplayer" | "single",
    setRoomCode: (code: string) => void,
    setPlayerCount: (count: number) => void
) => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (mode === "multiplayer") {
            const newWs = new WebSocket("ws://localhost:3002");

            newWs.onmessage = (message) => {
                try {
                    const data = JSON.parse(message.data);
                    console.log("WebSocket message:", data);

                    // Handle WebSocket messages based on the 'type' field
                    switch (data.type) {
                        case "roomCreated":
                            setRoomCode(data.roomCode); // Store room code
                            setPlayerCount(1); // Initialize with 1 player
                            break;

                        case "roomJoined":
                            setRoomCode(data.roomCode); // Store room code when joined
                            setPlayerCount(data.playerCount || 1); // Update player count
                            break;

                        case "playerCountUpdate":
                            // Only set playerCount when there's a valid player count update
                            if (data.playerCount) {
                                setPlayerCount(data.playerCount);
                            }
                            break;

                        case "bothPlayersConnected":
                            // Explicitly set player count to 2 when both players are confirmed connected
                            if (data.playerCount === 2) {
                                setPlayerCount(2); // Set player count to 2 when both players are connected
                            }
                            break;

                        case "roomFullOrNotFound":
                            console.error("Room is full or not found.");
                            break;

                        default:
                            console.warn("Unhandled WebSocket message:", data);
                            break;
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", message.data);
                }
            };

            newWs.onopen = () => {
                console.log("Connected to WebSocket server.");
            };

            newWs.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            newWs.onclose = () => {
                console.log("Disconnected from WebSocket server.");
            };

            // Store the WebSocket instance in the state
            setWs(newWs);

            // Cleanup the WebSocket connection on unmount
            return () => {
                if (newWs) {
                    newWs.close();
                }
            };
        }
    }, [mode, setRoomCode, setPlayerCount]);

    return ws;
};