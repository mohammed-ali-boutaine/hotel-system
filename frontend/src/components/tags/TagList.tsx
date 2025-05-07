import React from "react";
import { useTagStore } from "../../store/useTagStore";

interface TagListProps {
  selectedTags: string[];
  onTagChange: (tagId: string) => void;
}

const TagList: React.FC<TagListProps> = ({ selectedTags, onTagChange }) => {
  const { tags } = useTagStore();

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onTagChange(tag.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTags.includes(tag.id)
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tag.name}
          {selectedTags.includes(tag.id) && <span className="ml-1">×</span>}
        </button>
      ))}
    </div>
  );
};

export default TagList;
