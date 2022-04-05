import { useState } from "react";

const usePagination = ({ contentPerPage, count }) => {
    const [page, setPage] = useState(1);
    // сколько всего страниц
    const pageCount = Math.ceil(count / contentPerPage);
    // индекс последнего элемента на текущей странице
    const lastContentIndex = page * contentPerPage;
    // индекс первого элемента текущей страницы
    const firstContentIndex = lastContentIndex - contentPerPage;

    // change page based on direction either front or back
    const changePage = (direction) => {
        setPage((state) => {
            // move forward
            if (direction) {
                // if page is the last page, do nothing
                if (state === pageCount) {
                    return state;
                }
                return state + 1;
                // go back
            } else {
                // if page is the first page, do nothing
                if (state === 1) {
                    return state;
                }
                return state - 1;
            }
        });
    };

    const setPageSAFE = (num) => {
        // if number is greater than number of pages, set to last page
        if (num > pageCount) {
            setPage(pageCount);
            // if number is less than 1, set page to first page
        } else if (num < 1) {
            setPage(1);
        } else {
            setPage(num);
        }
    };

    return {
        totalPages: pageCount,
        nextPage: () => changePage(true),
        prevPage: () => changePage(false),
        setPage: setPageSAFE,
        firstContentIndex,
        lastContentIndex,
        page,
    };
};



export default usePagination;