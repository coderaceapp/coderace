import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faGamepad, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import UserMenu from "./UserMenu";
import { ThemeContext } from '../../context/ThemeContext';
import PlayerStatus from './PlayerStatus';

interface NavbarProps {
    setShowJoinModal: (value: boolean) => void;
    setShowHostModal: (value: boolean) => void;
    mode: string;
    setMode: (mode: "single" | "multiplayer") => void;
}

const Navbar: React.FC<NavbarProps> = ({ setShowJoinModal, setShowHostModal, mode, setMode }) => {
    const [connectedPlayers, setConnectedPlayers] = useState<boolean[]>([false, false]);
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'playerJoined') {
                const updatedPlayers = [...connectedPlayers];
                updatedPlayers[data.playerIndex] = true;
                setConnectedPlayers(updatedPlayers);
            }

            if (data.type === 'roomCreated') {
                console.log("Room created:", data.roomCode);
            }

            if (data.type === 'joinedRoom') {
                console.log("Joined room:", data.roomCode);
            }
        };

        return () => {
            ws.close();
        };
    }, [connectedPlayers]);

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.background,
                padding: "5px 15px",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                margin: "10px auto",
                height: "60px",
                color: colors.text,
                maxWidth: "1200px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                    style={{ ...buttonStyles, color: colors.text, backgroundColor: colors.buttonBackground }}
                    onClick={() => window.location.href = '/rankings'}
                >
                    <FontAwesomeIcon icon={faTrophy} /> Rankings
                </button>
                <button
                    onClick={() => setShowJoinModal(true)}
                    style={{ ...buttonStyles, color: colors.text, backgroundColor: colors.buttonBackground }}
                >
                    <FontAwesomeIcon icon={faGamepad} /> Join a Game
                </button>
                <button
                    onClick={() => setShowHostModal(true)}
                    style={{ ...buttonStyles, color: colors.text, backgroundColor: colors.buttonBackground }}
                >
                    <FontAwesomeIcon icon={faUserFriends} /> Host a Game
                </button>

                <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
                    <PlayerStatus connectedPlayers={connectedPlayers} />
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    width: "188px",
                    height: "36px",
                    backgroundColor: colors.buttonBackground,
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 5px",
                    cursor: "pointer",
                }}
                onClick={() => setMode(mode === "single" ? "multiplayer" : "single")}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "3px",
                        left: mode === "single" ? "3px" : "calc(100% - 93px)",
                        width: "88px",
                        height: "30px",
                        backgroundColor: colors.cardBackground,
                        borderRadius: "15px",
                        transition: "left 0.3s ease",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                        zIndex: 1,
                    }}
                />
                <div
                    style={{
                        width: "50%",
                        textAlign: "center",
                        color: mode === "single" ? colors.text : "#888",
                        zIndex: 2,
                        fontSize: "14px",
                    }}
                >
                    Single
                </div>
                <div
                    style={{
                        width: "50%",
                        textAlign: "center",
                        color: mode === "multiplayer" ? colors.text : "#888",
                        zIndex: 2,
                        fontSize: "14px",
                    }}
                >
                    Multi
                </div>
            </div>

            <UserMenu buttonStyles={buttonStyles} />
        </nav>
    );
};

const buttonStyles = {
    color: "#aaaaaa",
    fontSize: "12px",
    cursor: "pointer",
    background: "none",
    outline: "none",
    padding: "8px",
    height: "50px",
    width: "120px",
    boxSizing: "border-box" as const,
    transition: "border-color 0.3s ease",
    border: "2px solid transparent",
    textAlign: "center" as const,
    borderRadius: "5px",
    backgroundColor: "#161617",

    "&:active": {
        transform: "translateY(2px)",
    },
};

export default Navbar;