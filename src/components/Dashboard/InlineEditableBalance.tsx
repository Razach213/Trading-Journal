import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface InlineEditableBalanceProps {
  value: number;
  onSave: (newValue: number) => Promise<void>;
  label: string;
  className?: string;
  currency?: boolean;
  large?: boolean;
}

const InlineEditableBalance: React.FC<InlineEditableBalanceProps> = ({
  value,
  onSave,
  label,
  className = '',
  currency = true,
  large = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (amount: number) => {
    if (!currency) return amount.toString();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Auto-focus and select input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle escape key to cancel editing
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditing) {
        handleCancel();
      }
    };

    if (isEditing) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setEditValue(value.toString());
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    const numValue = parseFloat(editValue);
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      toast.error('Please enter a valid number');
      return;
    }

    if (numValue < 0) {
      setError('Balance cannot be negative');
      toast.error('Balance cannot be negative');
      return;
    }

    if (numValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Check if auth token exists
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError('No authentication token found. Please sign in again.');
        toast.error('Please sign in again to continue');
        return;
      }
      
      await onSave(numValue);
      setIsEditing(false);
      toast.success(`${label} updated successfully!`);
    } catch (error: any) {
      console.error('Error saving value:', error);
      setError(error.message || `Failed to update ${label.toLowerCase()}`);
      toast.error(`Failed to update ${label.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
    setError(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // Allow numbers, decimal point, and empty string
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setEditValue(inputValue);
    }
  };

  if (isEditing) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className="relative">
          {currency && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-300" />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`${currency ? 'pl-8' : 'pl-3'} pr-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white font-bold transition-all duration-200 ${
              large ? 'text-xl w-32' : 'text-base w-28'
            }`}
            placeholder="Enter amount"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Save changes"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
            title="Cancel editing"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {error && (
          <div className="absolute -bottom-6 left-0 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`group inline-flex items-center space-x-2 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEdit}
    >
      <span className={`font-bold transition-all duration-200 ${
        large ? 'text-2xl' : 'text-lg'
      } ${isHovered ? 'text-blue-300 dark:text-blue-300' : ''}`}>
        {currency ? formatCurrency(value) : formatNumber(value)}
      </span>
      
      <button
        className={`p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-300 dark:hover:text-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 transform ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
        }`}
        title={`Edit ${label.toLowerCase()}`}
      >
        <Edit2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default InlineEditableBalance;