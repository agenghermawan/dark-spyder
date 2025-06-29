import {useState, useEffect } from "react";
import {TrashIcon, PlusIcon, XMarkIcon} from "@heroicons/react/24/outline";


const SEARCH_TYPES = [
    {value: "username", label: "Stealer By Username", placeholder: "Enter username"},
    {value: "password", label: "Stealer By Password", placeholder: "Enter password"},
];

export default function StealerAdvancedSearchModal({
                                                       open,
                                                       onClose,
                                                       onSearch,
                                                       defaultDomain = "",
                                                       isLoading,
                                                   }) {
    const [domain, setDomain] = useState(defaultDomain);
    const [filters, setFilters] = useState([
        {type: "username", value: ""},
        {type: "password", value: ""},
    ]);

    const addFilter = () =>
        setFilters([...filters, {type: "username", value: ""}]);
    const updateFilter = (i, field, val) =>
        setFilters(filters.map((f, idx) => (i === idx ? {...f, [field]: val} : f)));
    const removeFilter = (i) => setFilters(filters.filter((_, idx) => idx !== i));

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (domain.trim()) params.domain = domain.trim();
        filters.forEach((f) => {
            if (f.value.trim()) params[f.type] = f.value.trim();
        });
        onSearch(params);
        onClose();
    };

    useEffect(() => {
        if (open) setDomain(defaultDomain);
    }, [open, defaultDomain]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-[#181820] w-6/12  rounded-xl shadow-2xl p-8 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700 transition"
                >
                    <XMarkIcon className="w-6 h-6 text-white"/>
                </button>
                <h3 className="text-xl font-bold text-white mb-6 text-center">Advanced Stealer Search</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Domain</label>
                        <input
                            type="text"
                            value={domain}
                            onChange={e => setDomain(e.target.value)}
                            placeholder="Enter domain (optional)"
                            className="w-full px-4 py-2 rounded-lg bg-black/30 text-white border border-gray-700 focus:ring-2 focus:ring-[#f03262]"
                        />
                    </div>
                    {filters.map((filter, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <select
                                value={filter.type}
                                onChange={e => updateFilter(idx, "type", e.target.value)}
                                className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-4 py-2 rounded-l-2xl focus:outline-none text-sm font-semibold"
                                style={{minWidth: 140}}
                            >
                                {SEARCH_TYPES.map(opt => (
                                    <option value={opt.value} key={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={filter.value}
                                onChange={e => updateFilter(idx, "value", e.target.value)}
                                placeholder={SEARCH_TYPES.find(s => s.value === filter.type)?.placeholder}
                                className="flex-1 px-3 py-2 rounded-r-2xl bg-[#23232c] text-white border border-blue-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => removeFilter(idx)}
                                className="p-2 hover:bg-red-700 rounded-full transition"
                                disabled={filters.length === 1}
                                title="Remove this filter"
                            >
                                <TrashIcon className="w-5 h-5 text-white"/>
                            </button>
                            {idx === filters.length - 1 && filters.length < 5 && (
                                <button
                                    type="button"
                                    onClick={addFilter}
                                    className="p-2 hover:bg-blue-700 rounded-full transition"
                                    title="Add filter"
                                >
                                    <PlusIcon className="w-5 h-5 text-white"/>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-3 mx-auto px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                    >
                        {isLoading ? "Searching..." : "Find"}
                    </button>
                </form>
            </div>
        </div>
    );
}