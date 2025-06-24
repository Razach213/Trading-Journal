import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Playbook } from '../types';
import toast from 'react-hot-toast';

// Demo mode flag
const isDemoMode = !db;

export const usePlaybooks = (userId: string | undefined) => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError(null);
      setPlaybooks([]);
      return;
    }

    if (isDemoMode) {
      // Demo mode - load from localStorage
      try {
        const demoPlaybooks = localStorage.getItem(`demoPlaybooks_${userId}`);
        if (demoPlaybooks) {
          const parsedPlaybooks = JSON.parse(demoPlaybooks).map((playbook: any) => ({
            ...playbook,
            createdAt: new Date(playbook.createdAt),
            updatedAt: new Date(playbook.updatedAt)
          }));
          setPlaybooks(parsedPlaybooks);
        } else {
          setPlaybooks([]);
        }
      } catch (error) {
        console.error('Error loading demo playbooks:', error);
        setPlaybooks([]);
      }
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Try simple query first, then fall back to complex query
    const trySimpleQuery = async () => {
      try {
        // First try a simple query without orderBy
        const simpleQuery = query(
          collection(db, 'playbooks'),
          where('userId', '==', userId)
        );

        const snapshot = await getDocs(simpleQuery);
        const playbooksData: Playbook[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          const playbook: Playbook = {
            id: doc.id,
            userId: data.userId || '',
            title: data.title || '',
            description: data.description || '',
            strategy: data.strategy || '',
            chartImage: data.chartImage || null,
            imageMetadata: data.imageMetadata || null,
            tags: Array.isArray(data.tags) ? data.tags : [],
            marketConditions: data.marketConditions || null,
            entryRules: data.entryRules || null,
            exitRules: data.exitRules || null,
            riskManagement: data.riskManagement || null,
            notes: data.notes || null,
            isPublic: Boolean(data.isPublic),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          };
          
          playbooksData.push(playbook);
        });

        // Sort manually by createdAt
        playbooksData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        setPlaybooks(playbooksData);
        setError(null);
        setLoading(false);

        // Now set up real-time listener with simple query
        const unsubscribe = onSnapshot(
          simpleQuery,
          (snapshot) => {
            try {
              const updatedPlaybooks: Playbook[] = [];
              snapshot.forEach((doc) => {
                const data = doc.data();
                
                const playbook: Playbook = {
                  id: doc.id,
                  userId: data.userId || '',
                  title: data.title || '',
                  description: data.description || '',
                  strategy: data.strategy || '',
                  chartImage: data.chartImage || null,
                  imageMetadata: data.imageMetadata || null,
                  tags: Array.isArray(data.tags) ? data.tags : [],
                  marketConditions: data.marketConditions || null,
                  entryRules: data.entryRules || null,
                  exitRules: data.exitRules || null,
                  riskManagement: data.riskManagement || null,
                  notes: data.notes || null,
                  isPublic: Boolean(data.isPublic),
                  createdAt: data.createdAt?.toDate() || new Date(),
                  updatedAt: data.updatedAt?.toDate() || new Date()
                };
                
                updatedPlaybooks.push(playbook);
              });
              
              // Sort manually by createdAt
              updatedPlaybooks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
              setPlaybooks(updatedPlaybooks);
              setError(null);
            } catch (err) {
              console.error('Error processing playbooks data:', err);
              setError('Failed to process playbooks data');
            }
          },
          (err) => {
            console.error('Error in playbooks listener:', err);
            setError('Failed to sync playbooks. Please refresh the page.');
          }
        );

        return unsubscribe;

      } catch (err: any) {
        console.error('Error with simple query:', err);
        
        if (err.code === 'failed-precondition') {
          setError('Database is being set up. This usually takes a few minutes for new Firebase projects.');
        } else if (err.code === 'permission-denied') {
          setError('You don\'t have permission to access this data. Please sign in again.');
        } else if (err.code === 'unavailable') {
          setError('Service is temporarily unavailable. Please check your internet connection.');
        } else {
          setError('Failed to load playbooks. Please try refreshing the page.');
        }
        setLoading(false);
      }
    };

    trySimpleQuery();
  }, [userId]);

  const addPlaybook = async (playbookData: Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (isDemoMode) {
        // Demo mode - save to localStorage
        const newPlaybook: Playbook = {
          ...playbookData,
          id: 'demo-' + Date.now(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const updatedPlaybooks = [newPlaybook, ...playbooks];
        setPlaybooks(updatedPlaybooks);
        localStorage.setItem(`demoPlaybooks_${playbookData.userId}`, JSON.stringify(updatedPlaybooks));
        toast.success('Playbook added successfully! (Demo Mode)');
        return;
      }

      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      // Validate image size if present
      if (playbookData.chartImage) {
        const imageSizeKB = (playbookData.chartImage.length * 3) / 4 / 1024; // Rough Base64 size calculation
        if (imageSizeKB > 500) { // 500KB limit
          throw new Error('Image size too large. Please compress the image or use a smaller file.');
        }
      }

      const playbook = {
        userId: auth.currentUser.uid,
        title: playbookData.title || '',
        description: playbookData.description || '',
        strategy: playbookData.strategy || '',
        chartImage: playbookData.chartImage || null,
        imageMetadata: playbookData.imageMetadata || null,
        tags: Array.isArray(playbookData.tags) ? playbookData.tags.filter(tag => tag.trim().length > 0) : [],
        marketConditions: playbookData.marketConditions?.trim() || null,
        entryRules: playbookData.entryRules?.trim() || null,
        exitRules: playbookData.exitRules?.trim() || null,
        riskManagement: playbookData.riskManagement?.trim() || null,
        notes: playbookData.notes?.trim() || null,
        isPublic: Boolean(playbookData.isPublic),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'playbooks'), playbook);
      toast.success('Playbook added successfully!');
    } catch (error: any) {
      console.error('Error adding playbook:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check your authentication and try again.');
      } else {
        toast.error(error.message || 'Failed to add playbook');
      }
      throw error;
    }
  };

  const updatePlaybook = async (playbookId: string, updates: Partial<Playbook>) => {
    try {
      if (!playbookId) {
        throw new Error('Playbook ID is required');
      }

      if (isDemoMode) {
        // Demo mode - update in localStorage
        const updatedPlaybooks = playbooks.map(playbook => 
          playbook.id === playbookId ? { ...playbook, ...updates, updatedAt: new Date() } : playbook
        );
        setPlaybooks(updatedPlaybooks);
        
        // Get userId from the updated playbook
        const updatedPlaybook = updatedPlaybooks.find(p => p.id === playbookId);
        if (updatedPlaybook) {
          localStorage.setItem(`demoPlaybooks_${updatedPlaybook.userId}`, JSON.stringify(updatedPlaybooks));
        }
        
        toast.success('Playbook updated successfully! (Demo Mode)');
        return;
      }

      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      // Validate image size if present
      if (updates.chartImage) {
        const imageSizeKB = (updates.chartImage.length * 3) / 4 / 1024;
        if (imageSizeKB > 500) {
          throw new Error('Image size too large. Please compress the image or use a smaller file.');
        }
      }

      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'createdAt') {
          if (key === 'tags' && Array.isArray(value)) {
            acc[key] = value.filter(tag => tag.trim().length > 0);
          } else if (typeof value === 'string') {
            acc[key] = value.trim() || null;
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as any);

      await updateDoc(doc(db, 'playbooks', playbookId), {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      });
      toast.success('Playbook updated successfully!');
    } catch (error: any) {
      console.error('Error updating playbook:', error);
      toast.error(error.message || 'Failed to update playbook');
      throw error;
    }
  };

  const deletePlaybook = async (playbookId: string) => {
    try {
      if (!playbookId) {
        throw new Error('Playbook ID is required');
      }

      if (isDemoMode) {
        // Demo mode - remove from localStorage
        const updatedPlaybooks = playbooks.filter(playbook => playbook.id !== playbookId);
        setPlaybooks(updatedPlaybooks);
        
        // Get userId from the playbook being deleted
        const playbookToDelete = playbooks.find(p => p.id === playbookId);
        if (playbookToDelete) {
          localStorage.setItem(`demoPlaybooks_${playbookToDelete.userId}`, JSON.stringify(updatedPlaybooks));
        }
        
        toast.success('Playbook deleted successfully! (Demo Mode)');
        return;
      }

      if (!auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      await deleteDoc(doc(db, 'playbooks', playbookId));
      toast.success('Playbook deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting playbook:', error);
      toast.error(error.message || 'Failed to delete playbook');
      throw error;
    }
  };

  return {
    playbooks,
    loading,
    error,
    addPlaybook,
    updatePlaybook,
    deletePlaybook
  };
};