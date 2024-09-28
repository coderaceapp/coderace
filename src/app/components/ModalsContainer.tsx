import React from "react";
import Modal from "./Modals";

interface ModalsContainerProps {
    showHostModal: boolean;
    showJoinModal: boolean;
    setShowHostModal: (value: boolean) => void;
    setShowJoinModal: (value: boolean) => void;
    createRoom: () => void;
    joinRoom: (code: string) => void;
    roomCode: string;
    roomInput: string;
    setRoomCode: (value: string) => void;
    isConnected: boolean;
}

const ModalsContainer: React.FC<ModalsContainerProps> = ({
    showHostModal,
    showJoinModal,
    setShowHostModal,
    setShowJoinModal,
    createRoom,
    joinRoom,
    roomCode,
    roomInput,
    setRoomCode,
    isConnected,
}) => (
    <>
        <Modal
            show={showHostModal}
            handleClose={() => setShowHostModal(false)}
            createRoom={createRoom}
            roomCode={roomCode}
            isConnected={isConnected}
            isHostModal={true}
        />
        <Modal
            show={showJoinModal}
            handleClose={() => setShowJoinModal(false)}
            joinRoom={joinRoom}
            setRoomCode={setRoomCode}
            roomInput={roomInput}
            isConnected={isConnected}
            isHostModal={false}
        />
    </>
);

export default ModalsContainer;
