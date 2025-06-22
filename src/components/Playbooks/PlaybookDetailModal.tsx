import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Tag, Globe, Lock, TrendingUp, Target, Shield, FileText } from 'lucide-react';
import { Playbook } from '../../types';

interface PlaybookDetailModalProps {
  playbook: Playbook;
  onClose: () => void;
  onEdit: (playbook: Playbook) => void;
}

const PlaybookDetailModal: React.FC<PlaybookDetailModalProps> = ({ playbook, onClose, onEdit }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed-modal">
      <div ref={modalRef} className="modal-container">
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{playbook.title}</h2>
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
              onClick={() => onEdit(playbook)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onClose}
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
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
              {playbook.strategy}
            </div>
          </div>

          {/* Chart Image */}
          {playbook.chartImage && (
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chart Analysis</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img
                  src={playbook.chartImage}
                  alt={playbook.title}
                  className="w-full h-auto max-h-96 object-contain bg-gray-50 dark:bg-gray-700"
                />
              </div>
              {playbook.imageMetadata && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Image size: {Math.round((playbook.imageMetadata.compressedSize || 0) / 1024)}KB
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{playbook.description}</p>
          </div>

          {/* Trading Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {playbook.entryRules && (
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  Entry Rules
                </h4>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.entryRules}</p>
                </div>
              </div>
            )}

            {playbook.exitRules && (
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                  <Target className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                  Exit Rules
                </h4>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.exitRules}</p>
                </div>
              </div>
            )}

            {playbook.riskManagement && (
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Risk Management
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.riskManagement}</p>
                </div>
              </div>
            )}

            {playbook.marketConditions && (
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Market Conditions
                </h4>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{playbook.marketConditions}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {playbook.tags.length > 0 && (
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {playbook.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {playbook.notes && (
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
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