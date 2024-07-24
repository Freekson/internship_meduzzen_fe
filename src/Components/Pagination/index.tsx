import React from "react";
import { useAppDispatch } from "../../Store/store";
import { setActivePage } from "../../Store/user/slice";
import styles from "./Pagination.module.scss";

type TProps = {
  pageCount: number;
  activePage: number;
};

const Pagination: React.FC<TProps> = ({ pageCount, activePage }) => {
  const dispatch = useAppDispatch();

  const handlePrevious = () => {
    if (activePage > 1) {
      dispatch(setActivePage(activePage - 1));
    }
  };

  const handleNext = () => {
    if (activePage < pageCount) {
      dispatch(setActivePage(activePage + 1));
    }
  };

  const handlePageClick = (pageNumber: number) => {
    dispatch(setActivePage(pageNumber));
  };

  const renderPages = () => {
    let pages = [];

    if (pageCount <= 8) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (activePage > 4) {
        pages.push("...");
      }
      let startPage = Math.max(2, activePage - 1);
      let endPage = Math.min(pageCount - 1, activePage + 1);

      if (startPage > 2) {
        pages.push(startPage - 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < pageCount - 1) {
        pages.push(endPage + 1);
      }
      if (activePage < pageCount - 3) {
        pages.push("...");
      }
      pages.push(pageCount);
    }

    return pages.map((page, index) => (
      <span
        key={index}
        className={`${styles.pageItem} ${
          page === activePage ? styles.active : ""
        }`}
        onClick={() => typeof page === "number" && handlePageClick(page)}
      >
        {page}
      </span>
    ));
  };

  return (
    <div className={styles.pagination}>
      <span className={styles.pageItem} onClick={handlePrevious}>
        &lt;
      </span>
      {renderPages()}
      <span className={styles.pageItem} onClick={handleNext}>
        &gt;
      </span>
    </div>
  );
};

export default Pagination;
