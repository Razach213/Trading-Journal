import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Playbook } from '../../types';
import { compressImage, validateImageFile, getImageMetadata, formatFileSize } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

interface AddPlaybookModalProps {
  onClose: () => void;
  onSubmit: (playbook: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
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

const AddPlaybookModal: React.FC<AddPlaybookModalProps> = ({ onClose, onSubmit, userId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PlaybookFormData>();
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<any>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onClose();
    } catch (error) {
      console.error('Error submitting playbook:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Playbook</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Breakout Strategy"
              />
              {errors.title && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Strategy *
              </label>
              <input
                type="text"
                {...register('strategy', { required: 'Strategy is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Momentum, Reversal, Scalping"
              />
              {errors.strategy && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.strategy.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of this trading setup..."
            />
            {errors.description && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Chart Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chart Screenshot
            </label>
            
            {!chartImage ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
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
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {isCompressing ? (
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isCompressing ? 'Compressing image...' : 'Click to upload chart screenshot'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, WebP up to 10MB (will be compressed)
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={chartImage}
                  alt="Chart preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                {imageMetadata && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Compressed to {formatFileSize(imageMetadata.compressedSize)} 
                    (original: {formatFileSize(imageMetadata.size)})
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trading Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Rules
              </label>
              <textarea
                {...register('entryRules')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="When to enter the trade..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exit Rules
              </label>
              <textarea
                {...register('exitRules')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="When to exit the trade..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Market Conditions
              </label>
              <textarea
                {...register('marketConditions')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Best market conditions for this setup..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Management
              </label>
              <textarea
                {...register('riskManagement')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Stop loss, position sizing, etc..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="momentum, breakout, high-volume (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Any additional observations or notes..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isPublic')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Make this playbook public (visible to other traders)
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Playbook'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaybookModal;