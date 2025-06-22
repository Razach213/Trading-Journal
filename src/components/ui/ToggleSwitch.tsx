import React from 'react';

interface ToggleSwitchProps {
  id: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  labelPosition?: 'left' | 'right';
  ariaLabel?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  labelPosition = 'right',
  ariaLabel
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {label && labelPosition === 'left' && (
        <label htmlFor={id} className="toggle-label mr-2">
          {label}
        </label>
      )}
      
      <label className="toggle-switch">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-label={ariaLabel || label}
        />
        <span className="toggle-track">
          <span className="toggle-thumb"></span>
        </span>
      </label>
      
      {label && labelPosition === 'right' && (
        <label htmlFor={id} className="toggle-label ml-2">
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;