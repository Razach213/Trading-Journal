import React, { useState } from 'react';
import { BookOpen, TrendingUp, Target, CheckCircle, AlertCircle, Plus, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Playbook, TradingStats, AccountBalance } from '../../types';
import toast from 'react-hot-toast';

interface PlaybookSidebarProps {
  playbooks: Playbook[];
  stats: TradingStats;
  accountBalance: AccountBalance | null;
  onUpdateBalance: (newBalance: number) => void;
}

interface RuleItem {
  id: string;
  text: string;
  checked: boolean;
  editable?: boolean;
}

interface ContextSection {
  id: string;
  title: string;
  color: string;
  rules: RuleItem[];
}

const PlaybookSidebar: React.FC<PlaybookSidebarProps> = ({ 
  playbooks, 
  stats, 
  accountBalance, 
  onUpdateBalance 
}) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState(accountBalance?.startingBalance?.toString() || '10000');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Initialize context sections with state
  const [contextSections, setContextSections] = useState<ContextSection[]>([
    {
      id: 'setup',
      title: 'SETUP CONTEXT',
      color: 'orange',
      rules: [
        {
          id: 'setup-1',
          text: 'Purpose of this setup is to capitalize on the pump (drive) that occurs right at open due to an increase in RVOL shorts getting squeezed off liquidity etc. This is supposed to be a quick trade - like a "scalp".',
          checked: true,
          editable: true
        }
      ]
    },
    {
      id: 'basic',
      title: 'BASIC CONTEXT',
      color: 'purple',
      rules: [
        {
          id: 'basic-1',
          text: 'RVOL on the underlying is at 1.4 or higher',
          checked: true,
          editable: true
        }
      ]
    },
    {
      id: 'liquidity',
      title: 'LIQUIDITY CONTEXT',
      color: 'red',
      rules: [
        {
          id: 'liquidity-1',
          text: 'Showing high long-term liquidity',
          checked: true,
          editable: true
        },
        {
          id: 'liquidity-2',
          text: 'We see absorption right at open',
          checked: true,
          editable: true
        },
        {
          id: 'liquidity-3',
          text: 'Bidding higher',
          checked: false,
          editable: true
        }
      ]
    },
    {
      id: 'volume',
      title: 'VOLUME CONTEXT',
      color: 'orange',
      rules: [
        {
          id: 'volume-1',
          text: 'Large buy volume // Large sell volume with no follow through right at open',
          checked: true,
          editable: true
        },
        {
          id: 'volume-2',
          text: 'VERY fast pace',
          checked: true,
          editable: true
        }
      ]
    }
  ]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleSaveBalance = () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance) && balance > 0) {
      onUpdateBalance(balance);
      setIsEditingBalance(false);
      toast.success('Starting balance updated!');
    } else {
      toast.error('Please enter a valid balance');
    }
  };

  const toggleRule = (sectionId: string, ruleId: string) => {
    setContextSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          rules: section.rules.map(rule => 
            rule.id === ruleId ? { ...rule, checked: !rule.checked } : rule
          )
        };
      }
      return section;
    }));
    toast.success('Rule updated!');
  };

  const startEditingRule = (ruleId: string, currentText: string) => {
    setEditingRule(ruleId);
    setEditingText(currentText);
  };

  const saveRuleEdit = (sectionId: string, ruleId: string) => {
    if (editingText.trim()) {
      setContextSections(prev => prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            rules: section.rules.map(rule => 
              rule.id === ruleId ? { ...rule, text: editingText.trim() } : rule
            )
          };
        }
        return section;
      }));
      setEditingRule(null);
      setEditingText('');
      toast.success('Rule updated!');
    }
  };

  const cancelRuleEdit = () => {
    setEditingRule(null);
    setEditingText('');
  };

  const addNewRule = (sectionId: string) => {
    const newRuleId = `${sectionId}-${Date.now()}`;
    setContextSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          rules: [
            ...section.rules,
            {
              id: newRuleId,
              text: 'New rule - click to edit',
              checked: false,
              editable: true
            }
          ]
        };
      }
      return section;
    }));
    startEditingRule(newRuleId, 'New rule - click to edit');
  };

  const deleteRule = (sectionId: string, ruleId: string) => {
    setContextSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          rules: section.rules.filter(rule => rule.id !== ruleId)
        };
      }
      return section;
    }));
    toast.success('Rule deleted!');
  };

  const checkAllRules = () => {
    setContextSections(prev => prev.map(section => ({
      ...section,
      rules: section.rules.map(rule => ({ ...rule, checked: true }))
    })));
    toast.success('All rules checked!');
  };

  const netPnL = accountBalance?.totalPnL || 0;
  const totalReturn = accountBalance?.totalReturnPercent || 0;
  const currentPlaybook = playbooks.length > 0 ? playbooks[0] : null;

  // Calculate rules followed percentage
  const totalRules = contextSections.reduce((sum, section) => sum + section.rules.length, 0);
  const checkedRules = contextSections.reduce((sum, section) => 
    sum + section.rules.filter(rule => rule.checked).length, 0
  );
  const rulesFollowedPercentage = totalRules > 0 ? Math.round((checkedRules / totalRules) * 100) : 0;

  const getColorClasses = (color: string) => {
    const colors = {
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stats</h3>
          <Link 
            to="/playbooks" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            Playbooks
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Net P&L</span>
            <span className={`text-lg font-bold ${
              netPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(netPnL)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Return</span>
            <span className={`text-lg font-bold ${
              totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Starting Balance</span>
            <div className="flex items-center space-x-2">
              {isEditingBalance ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveBalance()}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveBalance}
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBalance(false);
                      setNewBalance(accountBalance?.startingBalance?.toString() || '10000');
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(accountBalance?.startingBalance || 10000)}
                  </span>
                  <button
                    onClick={() => setIsEditingBalance(true)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playbook Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Playbook</h3>
          <Link 
            to="/playbooks" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {currentPlaybook ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-900 dark:text-white font-medium">
                  {currentPlaybook.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentPlaybook.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {currentPlaybook.strategy}
                </span>
                {currentPlaybook.tags.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{currentPlaybook.tags.length} tags
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No playbooks yet</p>
              <Link
                to="/playbooks"
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Create your first playbook
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Rules Followed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rules Followed</h3>
          <button 
            onClick={checkAllRules}
            className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            CHECK ALL
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {checkedRules}/{totalRules}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${rulesFollowedPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Based on your rules: {rulesFollowedPercentage}%
          </div>
        </div>
      </div>

      {/* Context Sections */}
      {contextSections.map((section) => (
        <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
              <div className={`w-2 h-2 ${getColorClasses(section.color)} rounded-full`}></div>
            </div>
            <button
              onClick={() => addNewRule(section.id)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Add new rule"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {section.rules.map((rule) => (
              <div key={rule.id} className="group">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleRule(section.id, rule.id)}
                    className={`mt-0.5 flex-shrink-0 transition-colors ${
                      rule.checked 
                        ? 'text-green-500 hover:text-green-600' 
                        : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'
                    }`}
                  >
                    {rule.checked ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded"></div>
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    {editingRule === rule.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => saveRuleEdit(section.id, rule.id)}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelRuleEdit}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between group">
                        <p 
                          className={`text-sm cursor-pointer transition-colors ${
                            rule.checked 
                              ? 'text-gray-600 dark:text-gray-400' 
                              : 'text-gray-500 dark:text-gray-500'
                          } hover:text-gray-800 dark:hover:text-gray-300`}
                          onClick={() => rule.editable && startEditingRule(rule.id, rule.text)}
                        >
                          {rule.text}
                        </p>
                        {rule.editable && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <button
                              onClick={() => startEditingRule(rule.id, rule.text)}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            {section.rules.length > 1 && (
                              <button
                                onClick={() => deleteRule(section.id, rule.id)}
                                className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Trading Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Trades Today:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {stats.totalTrades > 0 ? Math.min(stats.totalTrades, 5) : 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {stats.winRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Best Trade:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatCurrency(stats.largestWin)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Rules Followed:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {rulesFollowedPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookSidebar;