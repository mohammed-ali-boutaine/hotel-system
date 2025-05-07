// components/EditButton.tsx
import React from "react";
import { Link } from "react-router-dom";

interface EditButtonProps {
     to: string ;
}

const EditButton: React.FC<EditButtonProps> = ({ to }) => {
  return (
    <Link
      to={to}
      className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition duration-300 hover:scale-110"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </Link>
  );
};

export default EditButton;
