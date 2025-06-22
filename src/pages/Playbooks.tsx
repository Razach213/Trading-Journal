import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePlaybooks } from '../hooks/usePlaybooks';
import { Playbook } from '../types';
import PlaybookCard from '../components/Playbooks/PlaybookCard';
import AddPlaybookModal from '../components/Playbooks/AddPlaybookModal';
import PlaybookDetailModal from '../components/Playbooks/PlaybookDetailModal';
import ErrorBoundary from '../components/ErrorBoundary';

const Playbooks: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const { playbooks, loading, error, addPlaybook, updatePlaybook, deletePlaybook } = usePlaybooks(user?.id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStrategy, setFilterStrategy] = useState('');

  // Safe filter playbooks with error handling
  const filteredPlaybooks = React.useMemo(() => {
    try {
      if (!Array.isArray(playbooks)) {
        return [];
      }

      return playbooks.filter(playbook => {
        if (!playbook || typeof playbook !== 'object') {
          return false;
        }

        const title = playbook.title || '';
        const description = playbook.description || '';
        const tags = Array.isArray(playbook.tags) ? playbook.tags : [];
        const strategy = playbook.strategy || '';

        const matchesSearch = !searchTerm || 
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tags.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStrategy = !filterStrategy || 
          strategy.toLowerCase().includes(filterStrategy.toLowerCase());
        
        return matchesSearch && matchesStrategy;
      });
    } catch (error) {
      console.error('Error filtering playbooks:', error);
      return [];
    }
  }, [playbooks, searchTerm, filterStrategy]);

  // Get unique strategies for filter dropdown with error handling
  const strategies = React.useMemo(() => {
    try {
      if (!Array.isArray(playbooks)) {
        return [];
      }

      return Array.from(new Set(
        playbooks
          .map(p => p?.strategy)
          .filter(strategy => strategy && typeof strategy === 'string')
      )).sort();
    } catch (error) {
      console.error('Error getting strategies:', error);
      return [];
    }
  }, [playbooks]);

  const handleView = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
  };

  const handleEdit = (playbook: Playbook) => {
    setEditingPlaybook(playbook);
    setSelectedPlaybook(null);
  };

  const handleDelete = async (playbookId: string) => {
    try {
      await deletePlaybook(playbookId);
    } catch (error) {
      console.error('Error deleting playbook:', error);
    }
  };

  const handleAddPlaybook = async (playbookData: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addPlaybook(playbookData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding playbook:', error);
      // Don't close modal on error so user can retry
    }
  };

  const handleUpdatePlaybook = async (playbookData: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingPlaybook) return;
    
    try {
      await updatePlaybook(editingPlaybook.id, playbookData);
      setEditingPlaybook(null);
    } catch (error) {
      console.error('Error updating playbook:', error);
      // Don't close modal on error so user can retry
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your playbooks
          </h2>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo Mode Warning */}
          {isDemoMode && (
            <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <WifiOff className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">Demo Mode Active</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Firebase is not configured. Your playbooks are saved locally and won't sync across devices.
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    Configure Firebase in your .env file to enable full functionality.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
                Trading Playbooks
                {isDemoMode && (
                  <span className="ml-3 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium">
                    Demo Mode
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Save and organize your trading strategies and setups
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>New Playbook</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input - Fixed positioning of search icon */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search playbooks by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* Strategy Filter - Fixed positioning of filter icon */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Filter className="h-4 w-4" />
                </div>
                <select
                  value={filterStrategy}
                  onChange={(e) => setFilterStrategy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[200px] w-full md:w-auto"
                >
                  <option value="">All Strategies</option>
                  {strategies.map(strategy => (
                    <option key={strategy} value={strategy}>{strategy}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {(searchTerm || filterStrategy) && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredPlaybooks.length} of {playbooks.length} playbooks
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStrategy('');
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading playbooks...</h3>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your trading strategies.</p>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border border-red-200 dark:border-red-800">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Failed to load playbooks</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {error.includes('Database is being set up') 
                  ? 'Database is being set up. This usually takes a few minutes for new Firebase projects.'
                  : error || 'We encountered an error while loading your playbooks. Please try refreshing the page.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
                {error.includes('Database is being set up') && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <p>💡 This is normal for new Firebase projects</p>
                    <p>Database indexes are being created automatically</p>
                  </div>
                )}
              </div>
            </div>
          ) : filteredPlaybooks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-gray-400 dark:text-gray-500 mb-6">
                <BookOpen className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {searchTerm || filterStrategy ? 'No playbooks found' : 'No playbooks yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm || filterStrategy 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Start building your trading strategy library by creating your first playbook.'
                }
              </p>
              {!searchTerm && !filterStrategy && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Playbook
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaybooks.map((playbook) => (
                <PlaybookCard
                  key={playbook.id}
                  playbook={playbook}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Modals */}
          {showAddModal && (
            <AddPlaybookModal
              onClose={() => setShowAddModal(false)}
              onSubmit={handleAddPlaybook}
              userId={user.id}
            />
          )}

          {selectedPlaybook && (
            <PlaybookDetailModal
              playbook={selectedPlaybook}
              onClose={() => setSelectedPlaybook(null)}
              onEdit={handleEdit}
            />
          )}

          {editingPlaybook && (
            <AddPlaybookModal
              onClose={() => setEditingPlaybook(null)}
              onSubmit={handleUpdatePlaybook}
              userId={user.id}
              initialData={editingPlaybook}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Playbooks;