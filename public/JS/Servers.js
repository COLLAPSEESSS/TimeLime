let preloaderStartTime = new Date().getTime();
const MIN_PRELOADER_TIME = 500;

// Функция для показа всплывающих уведомлений
function ShowNotification(message, type = 'success', duration = 2000, iconSvg = null) {
    // Удаляем предыдущее уведомление если оно есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Создаем иконку если передана SVG
    let iconHTML = '';
    if (iconSvg) {
        iconHTML = `<svg class="notification-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="${iconSvg}"/>
        </svg>`;
    }
    
    notification.innerHTML = `
        ${iconHTML}
        <span>${message}</span>
    `;
    
    // Добавляем уведомление в DOM
    document.body.appendChild(notification);
    
    // Показываем уведомление с анимацией
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Скрываем уведомление через указанное время
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

document.addEventListener('DOMContentLoaded', function() {
    fetchServers();
});

function fetchServers() {
    const localCache = localStorage.getItem('serversCache');
    const cacheMeta = localStorage.getItem('serversCacheMeta');
    
    if (localCache && cacheMeta) {
        const { timestamp } = JSON.parse(cacheMeta);
        const now = new Date().getTime();
        
        if (now - timestamp < 300000) {
            try {
                const cachedData = JSON.parse(localCache);
                renderServers(cachedData);
                console.log('Используем кэшированные данные для быстрого отображения');
            } catch (e) {
                console.error('Ошибка при обработке кэша:', e);
            }
        }
    }
    
    fetchFreshData();
}

function fetchFreshData() {
    const timeoutId = setTimeout(() => {
        console.log('Превышено время ожидания ответа от сервера (5 секунд). Перезагрузка страницы...');
        window.location.reload();
    }, 5000);
    
    axios.get('/api/server')
        .then(response => {
            clearTimeout(timeoutId);
            
            localStorage.setItem('serversCache', JSON.stringify(response.data));
            localStorage.setItem('serversCacheMeta', JSON.stringify({ timestamp: new Date().getTime() }));
            
            renderServers(response.data);
            hidePreloaderWithMinTime();
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.error('Ошибка при получении данных о серверах:', error);
            hidePreloaderWithMinTime();
        });
}

function hidePreloaderWithMinTime() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - preloaderStartTime;
    
    if (elapsedTime >= MIN_PRELOADER_TIME) {
        preloader.hide();
    } else {
        const remainingTime = MIN_PRELOADER_TIME - elapsedTime;
        setTimeout(() => {
            preloader.hide();
        }, remainingTime);
    }
}

function renderServers(servers) {
    const serversContainer = document.getElementById('servers');
    if (!serversContainer) return;
    
    serversContainer.innerHTML = '';
    
    Object.values(servers).forEach(server => {
        const playerCount = server.Players;
        const maxPlayers = server.MaxPlayers;
        const queue = server.Queue;
        
        const progressPercent = maxPlayers > 0 ? (playerCount / maxPlayers) * 100 : 0;
        
        let playersText = `${playerCount} / ${maxPlayers}`;
        if (queue > 0) {
            playersText += ` (+${queue})`;
        }
        
        let tagsHTML = '';
        if (server.Tag_1) {
            tagsHTML += `<div class="server__stat" style="background: ${server.Stat_Style.Background}; border: 1px solid ${server.Stat_Style.Border}; color: ${server.Stat_Style.Color};">
                <span>${server.Tag_1}</span>
            </div>`;
        }
        
        if (server.Tag_2) {
            tagsHTML += `<div class="server__stat" style="background: ${server.Stat_Style.Background}; border: 1px solid ${server.Stat_Style.Border}; color: ${server.Stat_Style.Color};">
                <span>${server.Tag_2}</span>
            </div>`;
        }
        
        // Добавляем кнопку подключения если есть данные для подключения
        if (server.Connect) {
            tagsHTML += `<div class="server__stat server__connect-btn" onclick="connectToServer('${server.Connect}')" style="background: ${server.Stat_Style.Background}; border: 1px solid ${server.Stat_Style.Border}; color: ${server.Stat_Style.Color}; cursor: pointer;">
                <span><i class="fas fa-play"></i></span>
            </div>`;
        }
        
        const serverHTML = `
            <div class="server__inner">
                <div class="server__left">
                    <div class="server__info">
                        <div class="server__title">${server.Name}</div>
                        <div class="server__info-stats">
                            <div class="server__stats">
                                ${tagsHTML}
                            </div>
                            <div class="server__players"><i class="fas fa-users faha"></i> ${playersText}</div>
                        </div>
                        <div class="server__progress" style="background: #00000030;">
                            <div class="server__progress-bar" style="background: linear-gradient(270.00deg, ${server.Progress_Color.Start}, ${server.Progress_Color.End} 100%); width: ${progressPercent}%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        serversContainer.innerHTML += serverHTML;
    });
}

// Функция для подключения к серверу
function connectToServer(connectString) {
    // Копируем строку подключения в буфер обмена
    navigator.clipboard.writeText(connectString).then(() => {
        ShowNotification("IP-адрес скопирован!", "success", 2000, "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
        console.log("IP-адрес скопирован в буфер обмена!");
    }).catch(err => {
        console.error('Ошибка при копировании:', err);
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = connectString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        ShowNotification("IP-адрес скопирован!", "success", 2000, "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
        console.log("IP-адрес скопирован в буфер обмена!");
    });
}

