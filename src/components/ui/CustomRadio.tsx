import React from 'react';

interface CustomRadioProps {
  id: string;
  name: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  id,
  name,
  label,
  value,
  checked,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <label htmlFor={id} className={`custom-radio ${className}`}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <span className="radio-icon"></span>
      <span className="radio-label ml-2">{label}</span>
    </label>
  );
};

export default CustomRadio;