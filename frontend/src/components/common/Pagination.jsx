import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Prev
                </button>
                {start > 1 && <span className="px-2 text-gray-400">...</span>}
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${p === currentPage
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        {p}
                    </button>
                ))}
                {end < totalPages && <span className="px-2 text-gray-400">...</span>}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
