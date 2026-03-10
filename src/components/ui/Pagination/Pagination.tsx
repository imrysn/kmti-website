import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Logic to generate page numbers with ellipsis (...) for large sets
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max page numbers to show at once
    const halfPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > halfPages + 2) {
        pageNumbers.push('...');
      }

      let start = Math.max(2, currentPage - halfPages);
      let end = Math.min(totalPages - 1, currentPage + halfPages);

      if (currentPage <= halfPages + 1) {
        end = maxPagesToShow - 1;
      }

      if (currentPage >= totalPages - halfPages) {
        start = totalPages - maxPagesToShow + 2;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - halfPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-arrow"
        aria-label="Go to previous page"
      >
        &laquo;
      </button>
      {pageNumbers.map((number, index) =>
        typeof number === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(number)}
            className={`pagination-number ${currentPage === number ? 'active' : ''}`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ) : (
          <span key={index} className="pagination-ellipsis">
            {number}
          </span>
        )
      )}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
        aria-label="Go to next page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
