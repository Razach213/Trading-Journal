import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ArrowRight } from 'lucide-react';

interface PricingButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
}

const PricingButton: React.FC<PricingButtonProps> = ({
  className = '',
  children = 'Upgrade to Pro',
  variant = 'primary',
  size = 'md',
  icon = true
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/pricing');
    }
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
    secondary: 'bg-white text-blue-600 hover:bg-gray-50 border border-gray-300',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
      {icon && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
    </button>
  );
};

export default PricingButton;