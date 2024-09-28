import React, { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faGamepad, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import UserMenu from "./UserMenu";
import { ThemeContext } from '../../context/ThemeContext';

interface NavbarProps {
    setShowJoinModal: (value: boolean) => void;
    setShowHostModal: (value: boolean) => void;
    mode: string;
    setMode: (mode: "single" | "multiplayer") => void;
    showDropdown: boolean;
    setShowDropdown: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setShowJoinModal, setShowHostModal, mode, setMode, showDropdown, setShowDropdown }) => {

    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { theme, colors } = themeContext;

    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.borderColor = "#007BFF";
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.borderColor = "transparent";
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = "translateY(2px)";
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = "translateY(0px)";
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.background,
                padding: "5px 10px",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                margin: "20px auto",
                color: colors.text  // Ensure text color is applied from theme
            }}
        >
            <div style={{ display: "flex", gap: "15px" }}>
                {/* Link to Rankings Page */}
                <Link href="/rankings" passHref>
                    <button
                        style={{ ...buttonStyles, color: colors.text, backgroundColor: colors.buttonBackground }}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        <FontAwesomeIcon icon={faTrophy} /> Rankings
                    </button>
                </Link>
                <button
                    onClick={() => setShowJoinModal(true)}  // Show join game modal
                    style={{ ...buttonStyles, color: colors.text, backgroundColor: colors.buttonBackground }}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    <FontAwesomeIcon icon={faGamepad} /> Join a Game
                </button>
                <button
                    onClick={() => setShowHostModal(true)}  // Show host game modal
                    style={{ ...buttonStyles, color: colors.text, backgroundColor: colors.buttonBackground }}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    <FontAwesomeIcon icon={faUserFriends} /> Host a Game
                </button>

                {/* Dropdown for Single/Multiplayer */}
                <div style={{ position: "relative", display: "inline-block" }}>
                    <button
                        className="dropbtn"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            ...buttonStyles,
                            padding: "10px 15px",
                            width: "170px",
                            backgroundColor: colors.buttonBackground,
                            color: colors.text,
                        }}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        {mode === "single" ? "Single Player" : "Multiplayer"}
                    </button>

                    {showDropdown && (
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                backgroundColor: colors.buttonBackground,
                                color: colors.text,
                                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                                zIndex: 1,
                                borderRadius: "5px",
                                overflow: "hidden",
                                minWidth: "170px",
                            }}
                        >
                            <li>
                                <button
                                    onClick={() => {
                                        setMode("single");
                                        setShowDropdown(false);
                                    }}
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        padding: "12px 16px",
                                        borderBottom: `1px solid ${colors.text}`,
                                        backgroundColor: colors.buttonBackground,
                                        color: colors.text,
                                        cursor: "pointer",
                                    }}
                                >
                                    Single Player
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setMode("multiplayer");
                                        setShowDropdown(false);
                                    }}
                                    style={{
                                        width: "100%",
                                        textAlign: "left",
                                        padding: "12px 16px",
                                        backgroundColor: colors.buttonBackground,
                                        color: colors.text,
                                        cursor: "pointer",
                                    }}
                                >
                                    Multiplayer
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            <UserMenu buttonStyles={buttonStyles} />
        </nav>
    );
};

const buttonStyles = {
    color: "#aaaaaa",
    fontSize: "14px",
    cursor: "pointer",
    background: "none",
    outline: "none",
    padding: "10px",
    height: "50px",
    width: "150px",
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