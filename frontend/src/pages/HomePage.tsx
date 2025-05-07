import React, { useEffect } from "react";
import { useHotelStore } from "../store/useHotelStore";
import { useTagStore } from "../store/useTagStore";
import HotelGrid from "../components/hotel/HotelGrid";
import TagList from "../components/tags/TagList";

const Homepage: React.FC = () => {
  const { hotels, loading, fetchHomePageHotels } = useHotelStore();
  const { loading: tagsLoading, fetchTags } = useTagStore();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  useEffect(() => {
    fetchHomePageHotels();
    fetchTags();
  }, [fetchHomePageHotels, fetchTags]);

  const handleTagChange = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const getFilteredHotels = () => {
    return hotels.filter((hotel) => {
      // Filter by tags
      if (selectedTags.length > 0) {
        // Get hotel tags as an array of tag IDs
        const hotelTagIds = hotel.tags?.map((tag) => tag.id) || [];
        // Check if hotel has all selected tags
        return selectedTags.every((tagId) => hotelTagIds.includes(tagId));
      }
      return true;
    });
  };

  const filteredHotels = getFilteredHotels();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tags Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Filter by tags</h2>
        {tagsLoading ? (
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"
              />
            ))}
          </div>
        ) : (
          <TagList selectedTags={selectedTags} onTagChange={handleTagChange} />
        )}
      </div>

      {/* Clear Filters Button */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setSelectedTags([])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-4">
        {filteredHotels.length} hotels found
      </div>

      {/* Hotels Grid */}
      <HotelGrid
        hotels={filteredHotels}
        loading={loading}
        columns={{
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
        }}
        gap="gap-x-6 gap-y-8"
        skeletonCount={8}
      />
    </div>
  );
};

export default Homepage;
