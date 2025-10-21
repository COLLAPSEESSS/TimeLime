import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    // Load scripts after component mounts
    const scripts = [
      '/JS/Preloader.js',
      '/JS/Servers.js',
      '/JS/Burger.js',
      '/JS/Modal.js',
      '/JS/ScrollAnim.js'
    ];
    
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
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