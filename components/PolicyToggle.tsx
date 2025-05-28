
import React from 'react';
import { Policy, PolicyInfo } from '../types';

interface PolicyToggleProps {
  policyInfo: PolicyInfo;
  isActive: boolean;
  onToggle: (policy: Policy) => void;
}

const PolicyToggle: React.FC<PolicyToggleProps> = ({ policyInfo, isActive, onToggle }) => {
  const { id, label, description } = policyInfo;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg mb-2 hover:bg-gray-600 transition-colors">
      <div>
        <h4 className="font-semibold text-sky-400">{label}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onToggle(id)}
        title={isActive ? `Deactivate ${label}` : `Activate ${label}`}
        className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          isActive ? 'bg-green-500' : 'bg-gray-500'
        }`}
      >
        <span
          className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default PolicyToggle;
