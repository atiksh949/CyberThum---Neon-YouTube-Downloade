
import React from 'react';

interface NeonInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export const NeonInput: React.FC<NeonInputProps> = ({ value, onChange, placeholder, disabled }) => {
  return (
    <div className="relative w-full group">
      <div className="absolute -inset-1 bg-red-600 rounded blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
      <input
        type="text"
        disabled={disabled}
        className="relative w-full bg-black border border-red-900/50 rounded px-6 py-4 text-red-100 placeholder-red-900/60 focus:outline-none focus:border-red-500 transition-all font-rajdhani text-lg"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
    </div>
  );
};
