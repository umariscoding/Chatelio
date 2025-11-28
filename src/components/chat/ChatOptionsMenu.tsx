import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import MinimalInput from "@/components/ui/MinimalInput";
import MinimalButton from "@/components/ui/MinimalButton";
import { Icons } from "@/components/ui/Icons";

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
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleRename = async () => {
    if (!newTitle.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onRename(chatId, newTitle.trim());
      setShowRenameModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename chat");
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
      setError(err instanceof Error ? err.message : "Failed to delete chat");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuClick = (action: "rename" | "delete") => {
    setIsOpen(false);
    if (action === "rename") {
      setNewTitle(currentTitle);
      setShowRenameModal(true);
    } else {
      setShowDeleteModal(true);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-full hover:bg-zinc-800 transition-colors focus:outline-none"
        >
          <Icons.MoreVertical className="w-3.5 h-3.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-8 z-50 min-w-[140px] bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1">
            <button
              onClick={() => handleMenuClick("rename")}
              className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              <Icons.Edit className="w-3.5 h-3.5" />
              Rename
            </button>
            <button
              onClick={() => handleMenuClick("delete")}
              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              <Icons.Trash className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

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
              <h2 className="text-xl font-bold text-zinc-100">Rename Chat</h2>
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
              <h2 className="text-xl font-bold text-zinc-100">Delete Chat</h2>
              <p className="text-zinc-400 text-sm mt-2">
                Are you sure you want to delete this chat? This action cannot be
                undone.
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
