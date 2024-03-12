import React, { useState } from 'react';
import './FormationDropdown.css';

const FormationDropdown = ({ dropFormation, setDropFormation, handleFormationSelect, options}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    /**
     * Sets the vallue of dropFormation to selected formation and calls 
     * handleFormationSelect in App.js
     * @param {} selectedOption formation to be set
     */
    const handleChange = (selectedOption) => {
        //Displays options label rather than value
        const selectedLabel = options.find(option => option.value === selectedOption).label;
        setDropFormation(selectedLabel);
        toggleDropdown();
        handleFormationSelect(selectedOption);
    };

    return (
        <div className="dropdown">
            <button className="dropdown-btn" onClick={toggleDropdown}>{dropFormation}</button>
            {isOpen ? (
                <div className="dropdown-content">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="dropdown-option"
                            onClick={() => handleChange(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            ) : ''}
        </div>
    );
};

export default FormationDropdown;