import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Tag } from "../../types";

// interface Tag {
//   id: number;
//   name: string;
// }

interface TagSelectorProps {
  selectedTags: Tag[];
  onChange: (selectedTags: Tag[]) => void; // Change to expect Tag[]
  error?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags = [],
  onChange,
  error,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/tags");

        // Handle potential data structure differences
        const tagsData = response.data.data || response.data;
        setTags(Array.isArray(tagsData) ? tagsData : []);
        setLoadError(null);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setLoadError("Failed to load tags. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagToggle = (tagId: number) => {
    const isSelected = selectedTags.some(tag => tag.id === tagId);
    
    const updatedSelectedTags = isSelected
      ? selectedTags.filter(tag => tag.id !== tagId)
      : [...selectedTags, tags.find(tag => tag.id === tagId)!]; 
  
    onChange(updatedSelectedTags); 
  };

  if (isLoading) {
    return (
      <div className="my-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-5 w-5 text-[var(--primary-color)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading tags...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return <div className="my-4 text-red-500">{loadError}</div>;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Hotel Tags
      </label>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleTagToggle(tag.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium
        ${
          selectedTags.some((selected) => selected.id === tag.id)
            ? "bg-[var(--primary-color)] text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">No tags available</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TagSelector;
