import React, { useState, useContext } from 'react';
import PowerUpModal from './PowerUpModal'; // Correct import for PowerUpModal component
import { FaBomb, FaBullseye, FaEye, FaCloudMoon, FaExchangeAlt } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext
import PrecisionStrike from './PrecisionStrike'; // Import PrecisionStrike Component
import TacticalNuke from './TacticalNuke';
import GetPeek from './GetPeek';  // Import GetPeek component
import GlowSwap from './GlowSwap';  // Import GlowSwap component



interface PowerUp {
    name: string;
    description: string;
    icon: JSX.Element;
    color: string;
    mode: 'single' | 'multiplayer';  // Ensure mode is part of the props interface mode: 'single' | 'multiplayer';
}

const powerUps: PowerUp[] = [
    { name: 'Tactical Nuke', description: 'Remove an entire function, loop, or if statement.', icon: <FaBomb />, color: '#ff4c4c', mode: 'multiplayer' },
    { name: 'Precision Strike', description: 'Take out a line or variable.', icon: <FaBullseye />, color: '#ffa500', mode: 'multiplayer' },
    { name: 'Get Peek', description: 'See the general structure of opponent\'s code.', icon: <FaEye />, color: '#00bfff', mode: 'multiplayer' },
    { name: 'Glow Swap', description: 'Switch your opponent\'s theme to ludicrous mode.', icon: <FaCloudMoon />, color: '#8a2be2', mode: 'multiplayer' },
    { name: 'Change Language', description: 'Force opponent to code in another language.', icon: <FaExchangeAlt />, color: '#32cd32', mode: 'multiplayer' },
];

const PowerUpsBar: React.FC = () => {
    const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrecisionStrikeActive, setIsPrecisionStrikeActive] = useState(false);
    const [isNukeActive, setIsNukeActive] = useState(false);
    const [isGetPeekActive, setIsGetPeekActive] = useState(false);
    const [isGlowSwapActive, setIsGlowSwapActive] = useState(false);  // Add state for Glow Swap

    const [code, setCode] = useState<string[]>([
        'def factorial (n):',
        '   fact = 1',
        '   i = n',
        '   while i < n:',
        '       fact *= i',
        '       i -= 1',
        '   return fact',
    ]); // Initialize dummy code

    const dummyCode = [
        'def add(a, b):',
        '    sum = a + b',
        '    return sum',
        '',
        'for i in range(10):',
        '    print(i)',
        '',
        'if sum > 10:',
        '    print("Greater than 10")',
    ]; // Additional dummy code for GetPeek modal



    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is undefined. Ensure that ThemeProvider is wrapping the component.');
    }

    const { colors } = themeContext;

    const openModal = (powerUp: PowerUp) => {
        setSelectedPowerUp(powerUp);
        setIsModalOpen(true);
    };

    const activatePowerUp = () => {
        if (selectedPowerUp) {
            switch (selectedPowerUp.name) {
                case 'Tactical Nuke':
                    console.log('Tactical Nuke activated!');
                    // Add relevant functionality for Tactical Nuke here
                    setIsNukeActive(true);
                    break;
                case 'Precision Strike':
                    setIsPrecisionStrikeActive(true);  // Activate Precision Strike
                    break;
                case 'Get Peek':
                    setIsGetPeekActive(true);  // Activate Get Peek modal
                    break;
                case 'Glow Swap':
                    setIsGlowSwapActive(true);  // Activate Glow Swap modal
                    break;
                case 'Change Language':
                    console.log('Change Language activated!');
                    // Add relevant functionality for Change Language here
                    break;
                default:
                    console.log(`${selectedPowerUp.name} activated!`);
                    break;
            }
        }
        setIsModalOpen(false);  // Close the main power-up modal after activation
    };

    const handleStrikeConfirm = (updatedCode: string[]) => {
        setCode(updatedCode); // Update the code with the selected line removed
        setIsPrecisionStrikeActive(false); // Close PrecisionStrike modal
    };

    const handleNukeConfirm = (updateCode: string[]) => {
        setCode(updateCode);
        setIsNukeActive(false);
    }

    const handleGetPeekClose = () => {
        setIsGetPeekActive(false);  // Close Get Peek modal
    };

    const handleGlowSwapClose = () => {
        setIsGlowSwapActive(false);  // Close Glow Swap modal
    };

    return (
        <>

            <div className="vertical-bar">
                {powerUps.map((powerUp, index) => (
                    <div
                        key={index}
                        className="power-up"
                        onClick={() => openModal(powerUp)}
                        style={{ color: powerUp.color }}  // Apply color to each icon
                    >
                        {powerUp.icon}
                    </div>
                ))}
            </div>

            {/* PowerUp Modal */}
            {isModalOpen && selectedPowerUp && (
                <PowerUpModal show={isModalOpen} handleClose={() => setIsModalOpen(false)}>
                    <h2>{selectedPowerUp.name}</h2>
                    <p>{selectedPowerUp.description}</p>
                    <button onClick={activatePowerUp} style={{
                        backgroundColor: colors.buttonBackground,
                        color: colors.text,
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>Activate</button>
                </PowerUpModal>
            )}

            {/* Precision Strike Modal */}
            {isPrecisionStrikeActive && (
                <PowerUpModal show={isPrecisionStrikeActive} handleClose={() => setIsPrecisionStrikeActive(false)}>
                    <PrecisionStrike code={code} onConfirm={handleStrikeConfirm} />
                </PowerUpModal>
            )}

            {isNukeActive && (
                <PowerUpModal show={isNukeActive} handleClose={() => setIsNukeActive(false)}>
                    <TacticalNuke code={code} onConfirm={handleNukeConfirm} />
                </PowerUpModal>
            )}

            {isGetPeekActive && (
                <PowerUpModal show={isGetPeekActive} handleClose={handleGetPeekClose}>
                    <GetPeek code={dummyCode} handleClose={handleGetPeekClose} />
                </PowerUpModal>
            )}

            {/* Glow Swap Modal */}
            {isGlowSwapActive && (
                <PowerUpModal show={isGlowSwapActive} handleClose={handleGlowSwapClose}>
                    <GlowSwap onConfirm={handleGlowSwapClose} handleClose={handleGlowSwapClose} />
                </PowerUpModal>
            )}


            <style jsx>{`
                .vertical-bar {
                    display: flex;
                    flex-direction: column;
                    gap: 50px;
                    background-color: ${colors.background};  // Use theme's background color
                    padding: 40px;
                    border-radius: 10px;
                    justify-content: flex-start;
                    align-items: center;
                    width: 50px;
                    height: 100%;
                }

                .power-up {
                    cursor: pointer;
                    font-size: 30px;
                    padding: 10px;
                    border-radius: 50%;
                    background-color: ${colors.buttonBackground};  // Use theme's button background color
                    color: #fff;
                    transition: transform 0.3s ease, background-color 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .power-up:hover {
                    transform: scale(1.2);
                    background-color: ${colors.buttonTextSubmit};  // Change background on hover to the submit button color
                }
            `}</style>
        </>
    );
};

export default PowerUpsBar;
