import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Image as ImageIcon, Loader2, ArrowRight, BookOpen, TrendingUp, Target, Shield, FileText } from 'lucide-react';
import { Playbook } from '../../types';
import { compressImage, validateImageFile, getImageMetadata, formatFileSize } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

interface AddPlaybookModalProps {
  onClose: () => void;
  onSubmit: (playbook: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
  initialData?: Playbook;
}

interface PlaybookFormData {
  title: string;
  description: string;
  strategy: string;
  marketConditions?: string;
  entryRules?: string;
  exitRules?: string;
  riskManagement?: string;
  notes?: string;
  tags: string;
  isPublic: boolean;
}

const AddPlaybookModal: React.FC<AddPlaybookModalProps> = ({ 
  onClose, 
  onSubmit, 
  userId, 
  initialData 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PlaybookFormData>({
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      strategy: initialData.strategy,
      marketConditions: initialData.marketConditions || '',
      entryRules: initialData.entryRules || '',
      exitRules: initialData.exitRules || '',
      riskManagement: initialData.riskManagement || '',
      notes: initialData.notes || '',
      tags: initialData.tags.join(', '),
      isPublic: initialData.isPublic
    } : {}
  });
  
  const [chartImage, setChartImage] = useState<string | null>(initialData?.chartImage || null);
  const [imageMetadata, setImageMetadata] = useState<any>(initialData?.imageMetadata || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [animateIn, setAnimateIn] = useState(false);

  // Focus first input when modal opens and trigger animation
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 50);
    
    if (initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
    
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImage(file, 500); // 500KB limit
      const metadata = getImageMetadata(file, compressedDataUrl);
      
      setChartImage(compressedDataUrl);
      setImageMetadata(metadata);
      toast.success(`Image compressed from ${formatFileSize(metadata.size)} to ${formatFileSize(metadata.compressedSize)}`);
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Failed to process image. Please try a different file.');
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = () => {
    setChartImage(null);
    setImageMetadata(null);
  };

  const onFormSubmit = async (data: PlaybookFormData) => {
    setIsSubmitting(true);
    try {
      const playbook: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'> = {
        userId,
        title: data.title,
        description: data.description,
        strategy: data.strategy,
        chartImage,
        imageMetadata,
        marketConditions: data.marketConditions || null,
        entryRules: data.entryRules || null,
        exitRules: data.exitRules || null,
        riskManagement: data.riskManagement || null,
        notes: data.notes || null,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        isPublic: data.isPublic
      };

      await onSubmit(playbook);
      handleClose();
    } catch (error) {
      console.error('Error submitting playbook:', error);
      toast.error('Failed to save playbook. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed-modal backdrop-blur-sm">
      <div 
        ref={modalRef} 
        className={`modal-container ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{ 
          transition: 'all 0.3s ease-out',
          maxWidth: '750px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="modal-header bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-750">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="mr-3 bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            {initialData ? 'Edit Playbook' : 'Create New Playbook'}
          </h2>
          <button
            onClick={handleClose}
            className="modal-close-button"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="modal-body modal-scrollbar">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="modal-equal-fields">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  ref={initialFocusRef}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Breakout Strategy"
                />
                {errors.title && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Strategy *
                </label>
                <input
                  type="text"
                  {...register('strategy', { required: 'Strategy is required' })}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Momentum, Reversal, Scalping"
                />
                {errors.strategy && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.strategy.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Brief description of this trading setup..."
              />
              {errors.description && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Chart Image Upload */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chart Screenshot
              </label>
              
              {!chartImage ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="chart-upload"
                    disabled={isCompressing}
                  />
                  <label
                    htmlFor="chart-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    {isCompressing ? (
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {isCompressing ? 'Compressing image...' : 'Click to upload chart screenshot'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, WebP up to 10MB (will be compressed)
                    </span>
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Browse Files
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <img
                    src={chartImage}
                    alt="Chart preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {imageMetadata && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-xs text-white bg-black/50 backdrop-blur-sm">
                      <div className="flex justify-between">
                        <span>Original: {formatFileSize(imageMetadata.size)}</span>
                        <span>Compressed: {formatFileSize(imageMetadata.compressedSize)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trading Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  Entry Rules
                </label>
                <textarea
                  {...register('entryRules')}
                  rows={4}
                  className="w-full px-3 py-3 border border-green-200 dark:border-green-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white"
                  placeholder="When to enter the trade..."
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                  Exit Rules
                </label>
                <textarea
                  {...register('exitRules')}
                  rows={4}
                  className="w-full px-3 py-3 border border-red-200 dark:border-red-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-white"
                  placeholder="When to exit the trade..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Market Conditions
                </label>
                <textarea
                  {...register('marketConditions')}
                  rows={4}
                  className="w-full px-3 py-3 border border-purple-200 dark:border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-white"
                  placeholder="Best market conditions for this setup..."
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Risk Management
                </label>
                <textarea
                  {...register('riskManagement')}
                  rows={4}
                  className="w-full px-3 py-3 border border-blue-200 dark:border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white"
                  placeholder="Stop loss, position sizing, etc..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="momentum, breakout, high-volume (comma separated)"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Any additional observations or notes..."
              />
            </div>

            <div className="flex items-center">
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  {...register('isPublic')}
                />
                <span className="checkbox-icon">
                  <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor" style={{ display: 'none' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="checkbox-label">
                  Make this playbook public (visible to other traders)
                </span>
              </label>
            </div>
          </form>
        </div>

        <div className="modal-footer bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {initialData ? 'Update Playbook' : 'Create Playbook'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlaybookModal;