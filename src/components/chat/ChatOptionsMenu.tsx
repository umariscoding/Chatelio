'use client';

import React, { useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';
import Modal from '@/components/ui/Modal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalButton from '@/components/ui/MinimalButton';

interface ChatOptionsMenuProps {
  chatId: string;
  currentTitle: string;
  onRename: (chatId: string, newTitle: string) => Promise<void>;
  onDelete: (chatId: string) => Promise<void>;
}

const ChatOptionsMenu: React.FC<ChatOptionsMenuProps> = ({
  chatId,
  currentTitle,
  onRename,
  onDelete
}) => {
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onRename(chatId, newTitle.trim());
      setShowRenameModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onDelete(chatId);
      setShowDeleteModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chat');
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      label: 'Rename',
      onClick: () => {
        setNewTitle(currentTitle);
        setShowRenameModal(true);
      },
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      )
    },
    {
      label: 'Delete',
      onClick: () => setShowDeleteModal(true),
      className: 'text-red-400 hover:text-red-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      )
    }
  ];

  return (
    <>
      <Dropdown
        trigger={
          <div className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-full hover:bg-zinc-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        }
        items={menuItems}
        position="left"
        width="160px"
      />

      {/* Rename Modal */}
      {showRenameModal && (
        <Modal
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          title=""
          theme="dark"
          maxWidth="custom"
          customWidth="max-w-md"
        >
          <div className="px-2 py-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-zinc-100">
                Rename Chat
              </h2>
            </div>
            
            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <MinimalInput
                label="Chat Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="floating"
                required
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <MinimalButton
                  onClick={() => setShowRenameModal(false)}
                  variant="ghost"
                  disabled={isLoading}
                >
                  Cancel
                </MinimalButton>
                <MinimalButton
                  onClick={handleRename}
                  disabled={isLoading || !newTitle.trim()}
                  loading={isLoading}
                >
                  Save Changes
                </MinimalButton>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title=""
          theme="dark"
          maxWidth="custom"
          customWidth="max-w-md"
        >
          <div className="px-2 py-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-zinc-100">
                Delete Chat
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Are you sure you want to delete this chat? This action cannot be undone.
              </p>
            </div>
            
            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-2">
                <MinimalButton
                  onClick={() => setShowDeleteModal(false)}
                  variant="ghost"
                  disabled={isLoading}
                >
                  Cancel
                </MinimalButton>
                <MinimalButton
                  onClick={handleDelete}
                  disabled={isLoading}
                  loading={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Chat
                </MinimalButton>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ChatOptionsMenu;