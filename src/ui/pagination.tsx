import { PaginationProps } from "../context";
import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

export function Pagination({
  paginationMethods: {
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
  },
  paginationState: { pageIndex, pageCount, pageSize, total },
  paginationConfig,
}: PaginationProps) {
  if (pageCount === undefined) return null;

  let sliderMin = pageIndex - 2;
  let sliderMax = pageIndex + 2;

  if (sliderMin < 0) sliderMin = 0;
  if (sliderMax > pageCount - 1) sliderMax = pageCount - 1;

  const slider = [];
  for (let i = sliderMin; i <= sliderMax; i++) {
    slider.push(i);
  }

  return (
    <div className="bs5-pagination-wrapper">
      <div>
        <BootstrapPagination>
          <BootstrapPagination.Prev
            disabled={!getCanPreviousPage()}
            onClick={previousPage}
          />
          {sliderMin > 0 && (
            <BootstrapPagination.Item onClick={() => setPageIndex(0)}>
              {1}
            </BootstrapPagination.Item>
          )}
          {sliderMin > 1 && <BootstrapPagination.Ellipsis />}

          {slider.map((i) => (
            <BootstrapPagination.Item
              active={i == pageIndex}
              key={i}
              onClick={() => setPageIndex(i)}
            >
              {i + 1}
            </BootstrapPagination.Item>
          ))}

          {sliderMax < pageCount - 2 && <BootstrapPagination.Ellipsis />}

          {sliderMax < pageCount - 1 && (
            <BootstrapPagination.Item
              onClick={() => setPageIndex(pageCount - 1)}
            >
              {pageCount}
            </BootstrapPagination.Item>
          )}
          <BootstrapPagination.Next
            disabled={!getCanNextPage()}
            onClick={nextPage}
          />
        </BootstrapPagination>
        {total !== undefined && (
          <span>
            {total} {total === 1 ? "Eintrag" : "Einträge"}
          </span>
        )}
      </div>
      {paginationConfig?.pageSizeSelect && (
        <BootstrapPagination className="bs5-page-size-select">
          {paginationConfig.pageSizeSelect.map((size) => (
            <BootstrapPagination.Item
              active={size === pageSize}
              key={size}
              onClick={() => setPageSize(size)}
            >
              {size}
            </BootstrapPagination.Item>
          ))}
        </BootstrapPagination>
      )}
    </div>
  );
}
