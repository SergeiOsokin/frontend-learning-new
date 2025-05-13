export const autoResize = (target) => {
    // console.log(document.querySelector(`.${target}`))
    // if(tar)
    document.querySelector(`.${target}`).style.height = document.querySelector(`.${target}`).scrollHeight + 'px';
    // .forEach((el) => {
    //     el.style.height = el.scrollHeight + 'px';
    // })
};
