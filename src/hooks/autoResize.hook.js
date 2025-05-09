export const autoResize = () => {
    document.querySelectorAll('textarea').forEach((el) => {
        el.style.height = el.scrollHeight + 'px';
    })
};
