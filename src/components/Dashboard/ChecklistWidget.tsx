import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Copy, 
  FileDown,
  GripVertical,
  CheckCircle,
  Circle,
  MoreHorizontal
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface SortableItemProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ 
  item, 
  onToggle, 
  onEdit, 
  onDelete, 
  isEditing, 
  editText, 
  setEditText, 
  saveEdit, 
  cancelEdit 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-2 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 touch-none"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        {isEditing ? (
          <div className="flex-1 flex items-center">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
            <button 
              onClick={saveEdit}
              className="ml-2 p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Save className="h-4 w-4" />
            </button>
            <button 
              onClick={cancelEdit}
              className="ml-1 p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => onToggle(item.id)}
              className={`flex-shrink-0 mr-2 ${
                item.completed 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {item.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            
            <span 
              className={`flex-1 text-sm ${
                item.completed 
                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {item.text}
            </span>
            
            <div className="flex items-center ml-2">
              <button
                onClick={() => onEdit(item.id)}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface ChecklistWidgetProps {
  userId: string;
}

const ChecklistWidget: React.FC<ChecklistWidgetProps> = ({ userId }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load checklist from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem(`checklist_${userId}`);
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Error parsing saved checklist:', error);
      }
    } else {
      // Default items for new users
      const defaultItems: ChecklistItem[] = [
        { id: '1', text: 'Check market conditions before trading', completed: false },
        { id: '2', text: 'Review my trading plan', completed: false },
        { id: '3', text: 'Set stop loss for every trade', completed: false },
        { id: '4', text: 'Journal my trades with notes', completed: false }
      ];
      setItems(defaultItems);
      localStorage.setItem(`checklist_${userId}`, JSON.stringify(defaultItems));
    }
  }, [userId]);

  // Save checklist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`checklist_${userId}`, JSON.stringify(items));
  }, [items, userId]);

  const addItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false
    };
    
    setItems([...items, newItem]);
    setNewItemText('');
    
    toast.success('Item added to checklist');
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const startEditing = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      setEditingId(id);
      setEditText(item.text);
    }
  };

  const saveEdit = () => {
    if (!editText.trim() || !editingId) {
      cancelEdit();
      return;
    }
    
    setItems(items.map(item => 
      item.id === editingId ? { ...item, text: editText.trim() } : item
    ));
    
    setEditingId(null);
    setEditText('');
    
    toast.success('Item updated');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Item removed from checklist');
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const copyToClipboard = () => {
    const text = items.map(item => 
      `${item.completed ? '✓' : '☐'} ${item.text}`
    ).join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Checklist copied to clipboard'))
      .catch(() => toast.error('Failed to copy checklist'));
    
    setShowMenu(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Trading Checklist', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 30);
    
    // Add items
    doc.setFontSize(12);
    items.forEach((item, index) => {
      const y = 40 + (index * 10);
      doc.text(`${item.completed ? '✓' : '☐'} ${item.text}`, 14, y);
    });
    
    // Save the PDF
    doc.save(`trading_checklist_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast.success('Checklist exported to PDF');
    setShowMenu(false);
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full"
      whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trading Checklist</h3>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button 
                onClick={copyToClipboard}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy to clipboard</span>
              </button>
              <button 
                onClick={exportToPDF}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FileDown className="h-4 w-4" />
                <span>Export as PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a new item..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addItem();
              }
            }}
          />
          <button
            onClick={addItem}
            disabled={!newItemText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100vh-20rem)] md:max-h-[calc(100vh-24rem)]">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortableItem
                    item={item}
                    onToggle={toggleItem}
                    onEdit={startEditing}
                    onDelete={deleteItem}
                    isEditing={editingId === item.id}
                    editText={editText}
                    setEditText={setEditText}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
        
        {items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Your checklist is empty</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Add items to track your trading routine</p>
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {items.filter(item => item.completed).length} of {items.length} completed
            </span>
            <div className="bg-gray-200 dark:bg-gray-700 h-2 w-24 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 dark:bg-green-400 h-full"
                style={{ width: `${items.length > 0 ? (items.filter(item => item.completed).length / items.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChecklistWidget;

function format(date: Date, format: string): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return format.replace('yyyy', year.toString())
    .replace('MM', month)
    .replace('dd', day)
    .replace('PPP', `${month}/${day}/${year}`);
}