import React from "react";
import { Link } from "react-router-dom";

interface DetailLinkProps {
  to: string;
  name?: string;
}

const DetailLink: React.FC<DetailLinkProps> = ({ to, name }) => {
  return (
    <Link
      to={to}
      className="flex-1 py-2 px-3 text-center border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 text-gray-700 flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {name ?? "Detail"}
    </Link>
  );
};

export default DetailLink;
