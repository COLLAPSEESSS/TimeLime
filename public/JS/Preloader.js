let preloader;

document.addEventListener('DOMContentLoaded', function() {
    class Preloader {
        constructor() {
            this.preloader = document.createElement('div');
            this.preloader.className = 'preloader';
            this.preloader.innerHTML = `
                <div class="preloader__content">
                    <div class="preloader__spinner"></div>
                    <div class="preloader__text">Загрузка серверов...</div>
                </div>
            `;
            document.body.appendChild(this.preloader);
        }

        hide() {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            
            this.preloader.classList.add('preloader--hidden');
            setTimeout(() => {
                this.preloader.remove();
            }, 500);
        }
    }

    preloader = new Preloader();
});