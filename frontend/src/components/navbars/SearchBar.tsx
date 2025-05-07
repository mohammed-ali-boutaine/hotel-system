import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useHotelStore } from "../../store/useHotelStore";

// Define types
type TabType = "location" | "checkIn" | "checkOut" | "guests" | null;

const SearchBar: React.FC = () => {
  const { searchHotels } = useHotelStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [location, setLocation] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  const handleExpandSearch = (): void => {
    setIsExpanded(true);
    setActiveTab("location");
  };

  const handleFocus = (tab: TabType): void => {
    setActiveTab(tab);
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setIsExpanded(false);
      setActiveTab(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (): Promise<void> => {
    try {
      await searchHotels({
        location,
        checkIn,
        checkOut,
        guests,
      });
      setIsExpanded(false);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const LocationTab: React.FC = () => (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Where are you going?</h3>
      <div className="flex items-center border rounded-lg p-3 bg-gray-100">
        <MapPin className="text-gray-400 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search destinations"
          className="bg-transparent w-full outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          autoFocus
        />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Popular destinations</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            "New York",
            "Los Angeles",
            "Miami",
            "San Francisco",
            "Chicago",
            "Austin",
          ].map((city) => (
            <div
              key={city}
              className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => setLocation(city)}
            >
              <MapPin className="text-gray-500 mr-2" size={16} />
              <span>{city}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DateTab: React.FC<{ type: "checkIn" | "checkOut" }> = ({ type }) => (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">
        {type === "checkIn" ? "Check-in date" : "Check-out date"}
      </h3>
      <div className="flex items-center border rounded-lg p-3 bg-gray-100">
        <Calendar className="text-gray-400 mr-2" size={18} />
        <input
          type="date"
          className="bg-transparent w-full outline-none"
          value={type === "checkIn" ? checkIn : checkOut}
          onChange={(e) =>
            type === "checkIn"
              ? setCheckIn(e.target.value)
              : setCheckOut(e.target.value)
          }
          autoFocus
        />
      </div>
    </div>
  );

  const GuestsTab: React.FC = () => (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">How many guests?</h3>
      <div className="flex items-center justify-between border rounded-lg p-3 bg-gray-100">
        <div className="flex items-center">
          <Users className="text-gray-400 mr-2" size={18} />
          <span>
            {guests} guest{guests !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center">
          <button
            className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            disabled={guests <= 1}
          >
            -
          </button>
          <span className="mx-3">{guests}</span>
          <button
            className="w-8 h-8 rounded-full border flex items-center justify-center"
            onClick={() => setGuests(guests + 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );

  // Collapsed compact search bar
  if (!isExpanded) {
    return (
      <div className="flex justify-center items-center ">
        <div
          className="flex items-center border border-[var(--main-border)] rounded-full  bg-white cursor-pointer p-1  "
          onClick={handleExpandSearch}
          ref={searchBarRef}
        >
          <div className="flex items-center px-4 py-2">
            <Search size={18} className="text-gray-600 mr-2" />
            <span className="font-normal">Where to?</span>
          </div>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <div className="px-4 py-2 text-gray-600">Any week</div>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <div className="px-4 py-2 text-gray-600">Add guests</div>
          <button className="bg-[var(--primary-color)] p-2 rounded-full ml-2 flex items-center justify-center">
            <Search size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  // Expanded search interface
  return (
    <>
      <div className="fixed inset-0 bg-[#918f8f97] bg-opacity-25 flex justify-center items-center z-50">
        <div
          className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-2xl"
          ref={searchBarRef}
        >
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-6 text-center font-medium  text-base ${
                activeTab === "location" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => handleFocus("location")}
            >
              Where
            </button>
            <button
              className={`flex-1 py-6 text-center font-normal text-sm ${
                activeTab === "checkIn" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => handleFocus("checkIn")}
            >
              Check in
            </button>
            <button
              className={`flex-1 py-6 text-center font-normal text-sm  ${
                activeTab === "checkOut" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => handleFocus("checkOut")}
            >
              Check out
            </button>
            <button
              className={`flex-1 py-6 text-center font-normal text-sm  ${
                activeTab === "guests" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => handleFocus("guests")}
            >
              Guests
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "location" && <LocationTab />}
            {activeTab === "checkIn" && <DateTab type="checkIn" />}
            {activeTab === "checkOut" && <DateTab type="checkOut" />}
            {activeTab === "guests" && <GuestsTab />}
          </div>

          {/* Footer */}
          <div className="flex justify-between p-4 border-t">
            <button
              className="underline font-medium"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white px-6 py-3 rounded-lg font-medium"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
