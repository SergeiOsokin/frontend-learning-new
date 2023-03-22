import { useState } from "react";

const usePagination = ({ contentPerPage, count }) => {
    const [page, setPage] = useState(1);
    // сколько всего страниц
    const pageCount = Math.ceil(count / contentPerPage);
    // индекс последнего элемента на текущей странице
    const lastContentIndex = page * contentPerPage;
    // индекс первого элемента текущей страницы
    const firstContentIndex = lastContentIndex - contentPerPage;

    // переходы по страницам через "боковые кнопки"
    const changePage = (direction) => {
        setPage((state) => {
            // двигаемся вперед
            if (direction) {
                // если это последняя страница, ничего не делаем
                if (state === pageCount) {
                    return state;
                }
                // иначе переходим вперед
                return state + 1;
                // двигаемся назад
            } else {
                // если это первая страница, ничего не делаем
                if (state === 1) {
                    return state;
                }
                // иначе возвращаемся назад
                return state - 1;
            }
        });
    };

    return {
        totalPages: pageCount,
        nextPage: () => changePage(true),
        prevPage: () => changePage(false),
        firstContentIndex,
        lastContentIndex,
        page,
    };
};



export default usePagination;