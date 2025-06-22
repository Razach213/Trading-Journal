import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Tag, Globe, Lock, TrendingUp, Target, Shield, FileText, Edit, ArrowRight } from 'lucide-react';
import { Playbook } from '../../types';

interface PlaybookDetailModalProps {
  playbook: Playbook;
  onClose: () => void;
  onEdit: (playbook: Playbook) => void;
}

const PlaybookDetailModal: React.FC<PlaybookDetailModalProps> = ({ playbook, onClose, onEdit }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [animateIn, setAnimateIn] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 50);
    
    // Prevent body scroll
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Handle modal close with animation
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="fixed-modal backdrop-blur-sm">
      <div 
        ref={modalRef} 
        className={`modal-container ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{ 
          transition: 'all 0.3s ease-out',
          maxWidth: '800px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="modal-header bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-750">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{playbook.title}</h2>
            {playbook.isPublic ? (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                Public
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                Private
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => onEdit(playbook), 300);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-md"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleClose}
              className="modal-close-button"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="modal-body modal-scrollbar">
          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created {format(playbook.createdAt, 'MMM dd, yyyy')}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-medium">
              {playbook.strategy}
            </div>
          </div>

          {/* Chart Image */}
          {playbook.chartImage && (
            <div className="space-y-3 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <div className="mr-2 p-1 rounded bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                Chart Analysis
              </h3>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-lg">
                <div className="relative">
                  <img
                    src={playbook.chartImage}
                    alt={playbook.title}
                    className="w-full h-auto max-h-[400px] object-contain bg-gray-50 dark:bg-gray-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </div>
              {playbook.imageMetadata && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  Image size: {Math.round((playbook.imageMetadata.compressedSize || 0) / 1024)}KB
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 mb-8 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{playbook.description}</p>
          </div>

          {/* Trading Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {playbook.entryRules && (
              <div className="space-y-3 transform transition-all duration-300 hover:scale-[1.02]">
                <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  Entry Rules
                </h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.entryRules}</p>
                </div>
              </div>
            )}

            {playbook.exitRules && (
              <div className="space-y-3 transform transition-all duration-300 hover:scale-[1.02]">
                <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center">
                  <Target className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                  Exit Rules
                </h4>
                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.exitRules}</p>
                </div>
              </div>
            )}

            {playbook.riskManagement && (
              <div className="space-y-3 transform transition-all duration-300 hover:scale-[1.02]">
                <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Risk Management
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.riskManagement}</p>
                </div>
              </div>
            )}

            {playbook.marketConditions && (
              <div className="space-y-3 transform transition-all duration-300 hover:scale-[1.02]">
                <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Market Conditions
                </h4>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.marketConditions}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {playbook.tags.length > 0 && (
            <div className="space-y-3 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {playbook.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 shadow-sm"
                  >
                    <Tag className="h-3 w-3 mr-1.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {playbook.notes && (
            <div className="space-y-3 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Additional Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Created: {format(playbook.createdAt, 'PPP')}</span>
              <span>Last updated: {format(playbook.updatedAt, 'PPP')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookDetailModal;