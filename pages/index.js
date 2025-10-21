import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

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

// Делаем функцию доступной глобально
if (typeof window !== 'undefined') {
  window.connectToServer = connectToServer;
}

export default function Home() {
  useEffect(() => {
    // Initialize modal functionality
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

    // Initialize modal triggers
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);

      $trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal($target);
      });
    });

    // Initialize close buttons
    (document.querySelectorAll('.modal-background, .modal .delete') || []).forEach(($close) => {
      const $target = $close.closest('.modal');

      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });

    // Initialize escape key handler
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        closeAllModals();
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Expose helper to close the main selection modal
    window.closeMainModal = function() {
      const mainModal = document.getElementById('download-modal');
      if (mainModal) {
        closeModal(mainModal);
      }
    };

    // Initialize scroll animations
    const root = document.querySelector('.system__container');
    if (root) {
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
    }

    // Initialize servers
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
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.error('Ошибка при получении данных о серверах:', error);
        });
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

    // Initialize servers list
    fetchServers();

    // Load other scripts
    const scripts = [
      '/JS/Preloader.js',
      '/JS/Burger.js'
    ];
    
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="application-name" content="CALYPSO RUST - Сервер RUST на 236/177 DEV" />
        <meta name="theme-color" content="#42aaff" />
        <meta name="robots" content="index,follow" />
        <meta name="keywords" content="rust, раст, 177 devblog, 236 devblog, 177, 177 devblog, 236, calypsorust, calypso rust, пиратка, пиратский раст, пиратский rust, старый раст, старый rust, rust для слабых компьютеров, оптимизация rust, rust low-end pc, rust low specs, rust для слабых пк" />
        <meta name="description" content="Платформа для эффективной организации и управления рабочими процессами. Обеспечивает удобные инструменты для планирования, координации и мониторинга задач." />
        <meta property="og:title" content="CALYPSO RUST - Сервер RUST на 236/177 DEV" />
        <meta property="og:description" content="Бесплатный сервер RUST для комфортной игры на слабом железе" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calypsoproject.gamestores.app/" />
        <meta property="og:image" content="/Image/MainLogo.png" />
        <meta property="og:site_name" content="CALYPSO RUST - Сервер RUST на 236/177 DEV" />
        
        <link rel="icon" type="image/png" href="/Image/MainLogo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.5.1/css/all.css" />
        <link rel="stylesheet" href="/CSS/Style.css" />
        <link rel="stylesheet" href="/CSS/Bulma.css" />
        
        <title>CALYPSO RUST - Сервер RUST на 236/177 DEV</title>
      </Head>

      <Script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" strategy="beforeInteractive" />

      <header className="header">
        <div className="container">
          <div className="header__inner">
            <div className="header__left">
              <div className="header__logo">
                <h1>CALYPSO RUST</h1>
              </div>
              <nav className="header__nav">
                <a target="_blank" href="https://t.me/Qolach" className="header__link"><i className="fas fa-headset"></i> Тех-поддержка</a>
                <a href="#" className="header__link js-modal-trigger header__link--desktop" data-target="download-modal"><i className="fas fa-play"></i> Начать играть</a>
                <a target="_blank" href="https://calypsoproject.gamestores.app/" className="header__link shop-btn"><i className="fas fa-shopping-cart"></i> Магазин</a>
                <div className="header__social header__social--mobile">
                  <a target="_blank" href="https://vk.com/calypsorust" className="header__social-link"><i className="fab fa-vk"></i></a>
                  <a target="_blank" href="https://discord.gg/kQzrwuS357" className="header__social-link"><i className="fab fa-discord"></i></a>
                  <a target="_blank" href="https://t.me/calypsorust" className="header__social-link"><i className="fab fa-telegram"></i></a>
                </div>
              </nav>
              <div className="header__social header__social--desktop">
                <a target="_blank" href="https://vk.com/calypsorust" className="header__social-link"><i className="fab fa-vk"></i></a>
                <a target="_blank" href="https://discord.gg/kQzrwuS357" className="header__social-link"><i className="fab fa-discord"></i></a>
                <a target="_blank" href="https://t.me/calypsorust" className="header__social-link"><i className="fab fa-telegram"></i></a>
              </div>
            </div>
            <div className="header__right">
              <a target="_blank" href="https://calypsoproject.gamestores.app/" className="header__shop-btn"><i className="fas fa-shopping-cart"></i> Магазин</a>
              <div className="header__burger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="main__content">
            <h1 className="main__title">
              СТАРЫЙ RUST ЖДЁТ ТЕБЯ
            </h1>
            <div className="main__background-text">
              RUST
            </div>
            <p className="main__description">
              Покоряй мир ржавчины и радиации, объединяйся с игроками, рейди соседей и забирай их ресурсы
            </p>
            <div className="main__buttons">
              <a href="#" className="main__download-btn js-modal-trigger" data-target="download-modal">
                <i className="fas fa-download fasa"></i> Скачать клиент
              </a>
              <a href="#" className="main__download-btn js-modal-trigger" data-target="skins-modal">
                <i className="fas fa-gun fasa"></i> Скачать скины
              </a>
            </div>
          </div>
        </div>
        <div className="container servers" id="servers"></div>

        <div className="system__container" id="system-req">
          <div className="title__content reveal-top">
            <p>СИСТЕМНЫЕ ТРЕБОВАНИЯ</p>
          </div>
          <div className="systems__content">
            <div className="row g-2">
              <div className="col reveal-left">
                <p className="description sys">177 DEVBLOG</p>
                <div className="block" id="system">
                  <table>
                    <tbody>
                      <tr>
                        <td className="td-1">Операционная система:</td>
                        <td className="td-2">Windows 10, 11</td>
                      </tr>
                      <tr>
                        <td className="td-1">Процессор:</td>
                        <td className="td-2">Intel Core 2 duo</td>
                      </tr>
                      <tr>
                        <td className="td-1">Видеокарта:</td>
                        <td className="td-2">512мб VRAM</td>
                      </tr>
                      <tr>
                        <td className="td-1">Оперативная память:</td>
                        <td className="td-2">4гб RAM</td>
                      </tr>
                      <tr>
                        <td className="td-1">Место на диске:</td>
                        <td className="td-2">8гб HDD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col reveal-right">
                <p className="description sys">236 DEVBLOG</p>
                <div className="block">
                  <table>
                    <tbody>
                      <tr>
                        <td className="td-1">Операционная система:</td>
                        <td className="td-2">Windows 10, 11</td>
                      </tr>
                      <tr>
                        <td className="td-1">Процессор:</td>
                        <td className="td-2">Intel Core i3 6100F</td>
                      </tr>
                      <tr>
                        <td className="td-1">Видеокарта:</td>
                        <td className="td-2">1гб VRAM</td>
                      </tr>
                      <tr>
                        <td className="td-1">Оперативная память:</td>
                        <td className="td-2">6гб RAM</td>
                      </tr>
                      <tr>
                        <td className="td-1">Место на диске:</td>
                        <td className="td-2">30гб SSD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-spacer"></div>
      </main>

      {/* Модальные окна */}
      <div id="download-modal" className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Выберите девблог для игры</p>
            <button className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <div className="content">
              <div className="body__containers">
                <a href="#" className="container__a cont js-modal-trigger" data-target="dev177-modal" onClick={() => window.closeMainModal()}>
                  <div className="dev__info">
                    <h2>177 DEV</h2>
                    <div className="dev__features">
                      <span>Для слабых пк</span>
                      <span>Версия 2017 года</span>
                      <span>Для новичков</span>
                      <span>Старая графика</span>
                    </div>
                  </div>
                </a>
                <a href="#" className="container__b cont js-modal-trigger" data-target="dev236-modal" onClick={() => window.closeMainModal()}>
                  <div className="dev__info">
                    <h2>236 DEV</h2>
                    <div className="dev__features">
                      <span>Для средних пк</span>
                      <span>Версия 2019 года</span>
                      <span>Для опытных</span>
                      <span>Графика лучше</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div id="dev177-modal" className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">177 DEVBLOG - Выберите способ</p>
            <button className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <div className="content">
              <div className="download-options">
                <div className="download-option">
                  <img src="/Image/site.png" alt="С сайта" />
                  <p>С сайта</p>
                  <a target="_blank" href="https://download" className="download-link" download></a>
                </div>
                <div className="download-option">
                  <img src="/Image/google.png" alt="Google Disk" />
                  <p>Google Disk</p>
                  <a target="_blank" href="https://drive.google.com/file/" className="download-link" download></a>
                </div>
                <div className="download-option">
                  <img src="/Image/yandex.png" alt="Я.Диск" />
                  <p>Я.Диск</p>
                  <a target="_blank" href="https://disk.yandex.ru/" className="download-link" download></a>
                </div>
              </div>
              <p>Инструкция по установке</p>
              <ol className="install-instructions">
                <li>Скачайте файл, нажав на нужный сервис выше</li>
                <li>Распакуйте архив в удобную папку (например, C:/CalypsoRust)</li>
                <li>Запустите файл <strong>CalypsoLauncher.exe</strong> или <strong>RustClient.exe</strong></li>
              </ol>
            </div>
          </section>
        </div>
      </div>

      <div id="dev236-modal" className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">236 DEVBLOG - Выберите способ</p>
            <button className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <div className="content">
              <div className="download-options">
                <div className="download-option">
                  <img src="/Image/site.png" alt="С сайта" />
                  <p>С сайта</p>
                  <a target="_blank" href="https://download." className="download-link" download></a>
                </div>
                <div className="download-option">
                  <img src="/Image/google.png" alt="Google Disk" />
                  <p>Google Disk</p>
                  <a target="_blank" href="https://drive.google.com/file/" className="download-link" download></a>
                </div>
                <div className="download-option">
                  <img src="/Image/yandex.png" alt="Я.Диск" />
                  <p>Я.Диск</p>
                  <a target="_blank" href="https://disk." className="download-link" download></a>
                </div>
              </div>
              <p>Инструкция по установке</p>
              <ol className="install-instructions">
                <li>Скачайте файл, нажав на нужный сервис выше</li>
                <li>Распакуйте архив в удобную папку (например, C:/CalypsoRust)</li>
                <li>Запустите файл <strong>CalypsoLauncher.exe</strong> или <strong>RustClient.exe</strong></li>
              </ol>
            </div>
          </section>
        </div>
      </div>

      <div id="skins-modal" className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Скачать скины</p>
            <button className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <div className="content">
              <p>Выберите удобный способ</p>
              <div className="download-options">
                <div className="download-option">
                  <img src="/Image/site.png" alt="С сайта" />
                  <p>С сайта</p>
                  <a target="_blank" href="https://download" className="download-link" download></a>
                </div>
                <div className="download-option">
                  <img src="/Image/google.png" alt="Google Disk" />
                  <p>Google Disk</p>
                  <a target="_blank" href="https://drive.google.com/file/" className="download-link" download></a>
                </div>
                <div className="download-option">
                  <img src="/Image/yandex.png" alt="Я.Диск" />
                  <p>Я.Диск</p>
                  <a target="_blank" href="https://disk.yandex.ru/" className="download-link" download></a>
                </div>
              </div>
              <p>Инструкция по установке</p>
              <ol className="install-instructions">
                <li>Скачайте файл, нажав на нужный сервис выше</li>
                <li>Распакуйте архив в любую удобную папку</li>
                <li>Перенесите папку <strong>workshop</strong> в папку с игрой</li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
