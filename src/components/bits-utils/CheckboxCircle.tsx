import React from 'react';

export const CheckboxCircle = ({ label, onClick, checked, noneSelected }) => {
    return (
        <div className="container" onClick={onClick}>
            <div
                className={`round ${noneSelected && !checked && 'notSelected'}`}
            >
                <input
                    type="checkbox"
                    id={label}
                    checked={checked}
                    onChange={() => console.log('yeah')}
                />
                <label htmlFor="checkbox"></label>
            </div>
        </div>
    );
};
