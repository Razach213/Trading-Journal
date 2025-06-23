import React, { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Edit2, Trash2, Share2, Lock, Globe, Calendar, Tag } from 'lucide-react';
import { Playbook } from '../../types';

interface PlaybookCardProps {
  playbook: Playbook;
  onView: (playbook: Playbook) => void;
  onEdit: (playbook: Playbook) => void;
  onDelete: (playbookId: string) => void;
}

const PlaybookCard: React.FC<PlaybookCardProps> = ({ playbook, onView, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(playbook.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden group">
        {/* Chart Image */}
        {playbook.chartImage ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={playbook.chartImage}
              alt={playbook.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-3 right-3">
              {playbook.isPublic ? (
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </div>
              ) : (
                <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No chart image</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {playbook.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
              {playbook.strategy}
            </span>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              {format(playbook.createdAt, 'MMM dd, yyyy')}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {playbook.description}
          </p>

          {/* Tags */}
          {playbook.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {playbook.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </span>
              ))}
              {playbook.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{playbook.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onView(playbook)}
              className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">View</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(playbook)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Edit playbook"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete playbook"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed-modal">
          <div className="modal-container" style={{ maxWidth: "28rem" }}>
            <div className="modal-header">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Playbook</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="modal-close-button"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete "{playbook.title}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaybookCard;