import React from "react";

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked: boolean;
  id: string; 
}

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  checked,
  id,
  ...props
}) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        defaultChecked={checked}
        {...props}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
