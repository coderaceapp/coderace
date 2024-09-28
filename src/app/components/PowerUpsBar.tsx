import React, { useState, useContext } from 'react';
import PowerUpModal from './PowerUpModal'; // Correct import for PowerUpModal component
import { FaBomb, FaBullseye, FaEye, FaSatelliteDish, FaExchangeAlt } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

interface PowerUp {
    name: string;
    description: string;
    icon: JSX.Element;
    color: string;  // Add color property to power-ups
}

const powerUps: PowerUp[] = [
    { name: 'Tactical Nuke', description: 'Remove an entire function, loop, or if statement.', icon: <FaBomb />, color: '#ff4c4c' },
    { name: 'Precision Strike', description: 'Take out a line or variable.', icon: <FaBullseye />, color: '#ffa500' },
    { name: 'Get Peek', description: 'View opponent\'s list of identifiers.', icon: <FaEye />, color: '#00bfff' },
    { name: 'Radar', description: 'See the general structure of opponent\'s code.', icon: <FaSatelliteDish />, color: '#8a2be2' },
    { name: 'Change Language', description: 'Force opponent to code in another language.', icon: <FaExchangeAlt />, color: '#32cd32' },
];

const PowerUpsBar: React.FC = () => {
    const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const themeContext = useContext(ThemeContext);

    // Safety check to ensure ThemeContext is defined
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
            console.log(`${selectedPowerUp.name} activated!`);
        }
        setIsModalOpen(false);
    };

    return (
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
        </div>
    );
};

export default PowerUpsBar;