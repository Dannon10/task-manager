import React from "react";
import "./customCheckbox.css";

interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
    label, 
    checked, onChange }) => {
    return (
        <label className="custom-checkbox">
            <input
            title="Mark as completed"
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="label-text">{label}</span>
        </label>
    );
};

export default CustomCheckbox;
