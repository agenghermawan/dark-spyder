import React from 'react';
import { FaDatabase, FaQuestionCircle, FaCog, FaSearch } from 'react-icons/fa';

const SearchBoxWithShadow = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">
        What do you want to discover?
      </h1>
      <p className="mb-6 text-gray-400">
        Advanced exposure and vulnerability management from an attacker's perspective
      </p>

      {/* Search Box with Light Shadow */}
      <div className="relative w-full max-w-xl bg-gray-900 rounded-xl shadow-[0_0_20px_5px_rgba(138,43,226,0.5)]">
        <div className="flex items-center border-b border-gray-700 px-4 py-3">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Enter domain name you want to discover..."
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Buttons below */}
        {/* <div className="flex justify-around py-3 text-gray-400">
          <button className="flex items-center space-x-2 hover:text-white">
            <FaDatabase />
            <span>Upload Targets</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <FaQuestionCircle />
            <span>Integrations</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <FaCog />
            <span>Advanced Settings</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SearchBoxWithShadow;
