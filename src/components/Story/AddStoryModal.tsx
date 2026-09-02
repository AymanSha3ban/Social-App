import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../../apis/Auth/Users.api";
import type { UserType, Story } from "../../interfaces/interfaces";

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | undefined;
}

export default function AddStoryModal({ isOpen, onClose, user }: AddStoryModalProps) {
  const [mediaUrl, setMediaUrl] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const newStory: Story = {
        id: `s${Date.now()}`,
        mediaUrl: mediaUrl,
      };
      const updatedStories = [...(user.stories || []), newStory];
      await patchUser(String(user.id), { stories: updatedStories });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Users'] });
      queryClient.invalidateQueries({ queryKey: ['LoginedUser'] });
      setMediaUrl("");
      onClose();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Story</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input 
              type="text" 
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3 transition"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          {mediaUrl && (
            <div className="mt-4 rounded-xl overflow-hidden h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <img src={mediaUrl} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = "https://placehold.co/400x600?text=Invalid+Image+URL")} />
            </div>
          )}

          <button 
            onClick={() => mutate()}
            disabled={isPending || !mediaUrl.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? "Adding..." : "Add Story"}
          </button>
        </div>
      </div>
    </div>
  );
}
