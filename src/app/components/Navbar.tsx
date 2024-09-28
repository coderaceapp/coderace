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

    // Safety check to ensure ThemeContext is defined
    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

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
                backgroundColor: colors.background,  // Use background color from theme
                padding: "5px 10px",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                margin: "20px auto",
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
                            width: "170px",  // Increase the width to prevent wrapping
                            backgroundColor: colors.buttonBackground,  // Use button background from theme
                            color: colors.text,  // Use text color from theme
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
                                backgroundColor: colors.buttonBackground,  // Use button background from theme
                                color: colors.text,  // Use text color from theme
                                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                                zIndex: 1,
                                borderRadius: "5px",
                                overflow: "hidden",
                                minWidth: "170px",  // Match the dropdown width
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
                                        borderBottom: `1px solid ${colors.text}`,  // Border color based on theme
                                        backgroundColor: colors.buttonBackground,  // Dropdown background color
                                        color: colors.text,  // Dropdown text color
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
                                        backgroundColor: colors.buttonBackground,  // Dropdown background color
                                        color: colors.text,  // Dropdown text color
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

            {/* User Menu with buttonStyles prop */}
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
    padding: "10px",  // Consistent padding for all buttons
    height: "50px",  // Fixed height for all buttons
    width: "150px",  // Fixed width for all buttons
    boxSizing: "border-box" as const,  // Ensure padding and border are part of the box model
    transition: "border-color 0.3s ease",  // Smooth transition for hover/focus
    border: "2px solid transparent",  // Default border to ensure no layout shift
    textAlign: "center" as const,  // Center text alignment
    borderRadius: "5px",
    backgroundColor: "#161617",  // Consistent background

    "&:active": {
        transform: "translateY(2px)",
    },
};

export default Navbar;