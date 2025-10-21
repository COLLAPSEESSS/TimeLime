document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const body = document.body;

    burger.addEventListener('click', function() {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('lock');
    });
}); 