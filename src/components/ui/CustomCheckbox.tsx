import React from 'react';

interface CustomCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <label htmlFor={id} className={`custom-checkbox ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="checkbox-icon">
        <svg 
          className="h-3 w-3 text-white" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          style={{ display: checked ? 'block' : 'none' }}
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </span>
      <span className="checkbox-label ml-2">{label}</span>
    </label>
  );
};

export default CustomCheckbox;