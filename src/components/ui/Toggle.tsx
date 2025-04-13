import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span
                className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors ${
                    checked ? 'bg-purple-500' : 'bg-gray-300'
                }`}
            >
                <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                        checked ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
            </span>
        </label>
    );
};

export default Toggle;