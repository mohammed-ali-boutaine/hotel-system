export const AMENITIES = [
  { id: "wifi", label: "WiFi" },
  { id: "tv", label: "TV" },
  { id: "air_conditioning", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "minibar", label: "Minibar" },
  { id: "safe", label: "Safe" },
  { id: "desk", label: "Work Desk" },
  { id: "balcony", label: "Balcony" },
  { id: "ocean_view", label: "Ocean View" },
  { id: "mountain_view", label: "Mountain View" },
  { id: "city_view", label: "City View" },
  { id: "bathtub", label: "Bathtub" },
  { id: "shower", label: "Shower" },
  { id: "hairdryer", label: "Hairdryer" },
  { id: "coffee_maker", label: "Coffee Maker" },
  { id: "iron", label: "Iron" },
  { id: "phone", label: "Phone" },
  { id: "alarm_clock", label: "Alarm Clock" },
  { id: "blackout_curtains", label: "Blackout Curtains" },
  { id: "soundproofing", label: "Soundproofing" },
] as const;

export type AmenityId = (typeof AMENITIES)[number]["id"];
