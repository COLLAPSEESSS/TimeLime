document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.system__container');
    if (!root) return;

    const revealEls = root.querySelectorAll('.reveal-top, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target;
            if (entry.isIntersecting) {
                target.classList.add('is-visible');
                if (target.classList.contains('title__content')) {
                    root.classList.add('bg-visible');
                }
            } else {
                // Добавляем небольшую задержку перед скрытием
                setTimeout(() => {
                    if (!entry.isIntersecting) {
                        target.classList.remove('is-visible');
                        if (target.classList.contains('title__content')) {
                            root.classList.remove('bg-visible');
                        }
                    }
                }, 100);
            }
        });
    }, {
        root: null,
        threshold: 0.2,
        rootMargin: '0px 0px -20% 0px'
    });

    revealEls.forEach((el) => observer.observe(el));
});


