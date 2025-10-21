document.addEventListener('DOMContentLoaded', () => {
    function openModal($el) {
        $el.classList.add('is-active');
        document.documentElement.classList.add('is-clipped');
        $el.style.opacity = '0';
        setTimeout(() => {
            $el.style.transition = 'opacity 0.3s ease';
            $el.style.opacity = '1';
        }, 10);
    }

    function closeModal($el) {
        $el.style.opacity = '0';
        setTimeout(() => {
            $el.classList.remove('is-active');
            document.documentElement.classList.remove('is-clipped');
        }, 300);
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal($target);
        });
    });

    (document.querySelectorAll('.modal-background, .modal .delete') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    document.addEventListener('keydown', (event) => {
        const e = event || window.event;
        if (e.keyCode === 27) { 
            closeAllModals();
        }
    });

    // Expose helper to close the main selection modal before opening sub-modals
    window.closeMainModal = function() {
        const mainModal = document.getElementById('download-modal');
        if (mainModal) {
            closeModal(mainModal);
        }
    };
}); 