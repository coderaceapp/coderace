import React, { useEffect, useRef, useContext } from "react";
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

interface ModalProps {
    show: boolean;
    handleClose: () => void;
    createRoom?: () => void;
    joinRoom?: (roomCode: string) => void;
    setRoomCode?: (code: string) => void;
    roomInput?: string;
    roomCode?: string;
    isConnected?: boolean;
    isHostModal: boolean;
}

const Modal: React.FC<ModalProps> = ({
    show,
    handleClose,
    createRoom,
    joinRoom,
    setRoomCode,
    roomInput,
    roomCode,
    isConnected,
    isHostModal
}) => {
    const createRoomBtnRef = useRef<HTMLButtonElement | null>(null);

    const themeContext = useContext(ThemeContext);

    // Safety check to ensure ThemeContext is defined
    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    // Auto-focus the "Create Room" button when the modal opens in host mode
    useEffect(() => {
        if (show && isHostModal && createRoomBtnRef.current) {
            createRoomBtnRef.current.focus();
        }
    }, [show, isHostModal]);

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleClose}>&times;</span>
                <h3>{isHostModal ? "Host a Game" : "Join a Game"}</h3>

                {isHostModal ? (
                    <>
                        <button
                            ref={createRoomBtnRef}  // Reference the "Create Room" button
                            onClick={createRoom}
                            disabled={roomCode !== ''}
                            className="create-room-btn"
                        >
                            {roomCode ? "Room Created" : "Create Room"}
                        </button>
                        {roomCode && (
                            <p>
                                Your room code is: <strong>{roomCode}</strong>
                            </p>
                        )}
                        {isConnected && <p>Player connected! Ready to start the game.</p>}
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter Room Code"
                            value={roomInput || ""}
                            onChange={(e) => setRoomCode && setRoomCode(e.target.value)}
                        />
                        <button onClick={() => joinRoom && roomInput && joinRoom(roomInput)} className="join-room-btn">
                            Join Room
                        </button>
                        {isConnected && <p>Successfully joined the game!</p>}
                    </>
                )}
            </div>

            <style jsx>{`
                .modal {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                }

                .modal-content {
                    background-color: ${colors.background};  /* Use background color from theme */
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    width: 300px;
                    color: ${colors.text};  /* Use text color from theme */
                }

                .close {
                    color: ${colors.text};  /* Use text color for close button */
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .close:hover {
                    color: ${colors.powerUpModal.closeButtonHover};  /* Use hover color from theme */
                }

                /* General button styles */
                button {
                    background-color: ${colors.buttonBackground};  /* Button background from theme */
                    color: ${colors.text};  /* Button text color from theme */
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 10px;
                    font-size: 16px;
                    outline: none;  /* Remove default focus outline */
                    transition: background-color 0.3s ease;
                }

                button:disabled {
                    background-color: #6c757d;
                    cursor: not-allowed;
                }

                input {
                    padding: 10px;
                    width: 80%;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    margin-bottom: 10px;
                    background-color: ${colors.background};  /* Input background color from theme */
                    color: ${colors.text};  /* Input text color from theme */
                }

                p {
                    margin-top: 10px;
                    font-size: 14px;
                    color: ${colors.text};  /* Use text color from theme */
                }

                strong {
                    color: ${colors.buttonTextSubmit};  /* Highlight room code with theme color */
                }
            `}</style>
        </div>
    );
};

export default Modal;