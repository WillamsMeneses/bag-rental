import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const updatePagination = (meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }) => {
    setPage(meta.page);
    setLimit(meta.limit);
    setTotal(meta.total);
    setTotalPages(meta.totalPages);
    setHasMore(meta.hasMore);
  };

  const nextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const reset = () => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotal(0);
    setTotalPages(0);
    setHasMore(false);
  };

  return {
    // State
    page,
    limit,
    total,
    totalPages,
    hasMore,

    // Actions
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    reset,
    updatePagination,
  };
};