export const validation = () => {
    const validationInputs = (event) => {
        const form = event.target.closest(".form");
        const button = form.querySelector('.button');

        // проверка inputs
        // переделать на case
        switch (event.target.value.length) {
            case 0:
                event.target.style.cssText += 'border: 1px solid  rgba(255, 0, 0, .8);'
            break;
            default:
                event.target.style.cssText += 'border: 1px solid  rgba(0, 0, 0, .2);'
        }
        // проверка формы в общем
        if (form.checkValidity()) {
            button.removeAttribute('disabled', 'disabled');
            button.classList.remove('button-disable');
        } else {
            button.setAttribute('disabled', true);
            button.classList.add('button-disable');
        }

    }
    return { validationInputs }
};
