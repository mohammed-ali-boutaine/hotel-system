import React, { useState, useEffect } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { notifySuccess, notifyError } from "../utils/toast";
import { Room } from "../types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onSuccess?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  room,
  onSuccess,
}) => {
  const { createBooking, loading } = useBookingStore();
  const [bookingData, setBookingData] = useState({
    check_in: "",
    check_out: "",
    number_of_guests: 1,
    special_requests: "",
  });

  const [totalNights, setTotalNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (bookingData.check_in && bookingData.check_out) {
      const start = new Date(bookingData.check_in);
      const end = new Date(bookingData.check_out);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalNights(diffDays || 1);
      setTotalPrice((diffDays || 1) * room.price_per_night + 75); // Adding cleaning and service fees
    }
  }, [bookingData.check_in, bookingData.check_out, room.price_per_night]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBooking({
        room_id: room.id,
        ...bookingData,
      });
      notifySuccess("Booking created successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = Object.values(error.response.data.errors).flat().join("\n");
        notifyError(errors);
      } else {
        notifyError(error.response?.data?.message || "Failed to create booking");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Book Room</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={bookingData.check_in}
              onChange={(e) =>
                setBookingData({ ...bookingData, check_in: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              required
              min={bookingData.check_in || new Date().toISOString().split("T")[0]}
              value={bookingData.check_out}
              onChange={(e) =>
                setBookingData({ ...bookingData, check_out: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              max={room.capacity}
              required
              value={bookingData.number_of_guests}
              onChange={(e) =>
                setBookingData({
                  ...bookingData,
                  number_of_guests: parseInt(e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum capacity: {room.capacity} guests
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              value={bookingData.special_requests}
              onChange={(e) =>
                setBookingData({
                  ...bookingData,
                  special_requests: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {totalNights > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  ${room.price_per_night} x {totalNights} nights
                </span>
                <span>${room.price_per_night * totalNights}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Cleaning fee</span>
                <span>$40.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service fee</span>
                <span>$35.00</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;