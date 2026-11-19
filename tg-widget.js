/* ============================================================
   tg-widget.js — живой виджет Telegram-канала для страницы.
   Работает в двух режимах:

   1) РЕАЛЬНЫЕ ПОСТЫ (рекомендуемый способ):
      Telegram отдаёт посты через JSONP-эндпоинт вида
      https://api.telegram.org/widget/getMessages/<username>/<hash>?callback=...
      Хэш выдаётся при включении виджета канала:
      @BotFather -> /mybots -> выбрать бота -> Channel WebView /
      Widget -> "Copy code" — там будет параметр "hash".
      Просто впишите hash ниже и всё заработает само.

   2) DEMO-РЕЖИМ: если TG_HASH не задан, показываются
      статичные демо-сообщения (чтобы виджет не был пустым).
   ============================================================ */

(function () {
    "use strict";

    // ===== НАСТРОЙКИ =====
    var TG_USERNAME = "Killerofadeadgod"; // юзернейм канала без @
    var TG_HASH     = "";                 // <-- впиши сюда hash из @BotFather
    var MAX_POSTS   = 6;                  // сколько постов показывать
    // =====================

    var container = document.getElementById("tg-messages");
    if (!container) return;

    // ---------- Демо-посты (используются, если TG_HASH пустой) ----------
    var DEMO_POSTS = [
        { text: "Собрал новый сетап на Hyprland, наконец-то всё докрутил под себя 🖥️", date: "18 ноя" },
        { text: "Выложил новый скрипт на GitHub — чекер статуса серверов. Ссылка в шапке 👆", date: "15 ноя" },
        { text: "Кто нибудь ещё тестил RX 6700 XT на Arch? Делюсь конфигами 🔧", date: "12 ноя" },
        { text: "Недавно залил новые фото своего рабочего места. Как вам подсветка? ✨", date: "10 ноя" }
    ];

    // ---------- Утилиты ----------
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function formatDate(ts) {
        var d = new Date(ts * 1000);
        var months = ["янв", "фев", "мар", "апр", "май", "июн",
                      "июл", "авг", "сен", "окт", "ноя", "дек"];
        return d.getDate() + " " + months[d.getMonth()];
    }

    // Сообщение может содержать HTML-разметку от Telegram (<a>, <b>...) —
    // оставляем только безопасный набор тегов.
    function sanitizeHtml(html) {
        var tpl = document.createElement("div");
        tpl.innerHTML = html;
        var allowed = { A: 1, B: 1, STRONG: 1, I: 1, EM: 1, U: 1, BR: 1, CODE: 1, PRE: 1 };
        (function walk(node) {
            var children = Array.prototype.slice.call(node.childNodes);
            children.forEach(function (child) {
                if (child.nodeType === 1) { // элемент
                    if (!allowed[child.tagName]) {
                        // заменить запрещённый тег на его текстовое содержимое
                        while (child.firstChild) node.insertBefore(child.firstChild, child);
                        node.removeChild(child);
                    } else {
                        // вычистить атрибуты, кроме href у ссылок
                        Array.prototype.slice.call(child.attributes).forEach(function (attr) {
                            if (child.tagName === "A" && attr.name === "href") return;
                            child.removeAttribute(attr.name);
                        });
                        if (child.tagName === "A") {
                            child.setAttribute("target", "_blank");
                            child.setAttribute("rel", "noopener");
                        }
                        walk(child);
                    }
                }
            });
        })(tpl);
        return tpl.innerHTML;
    }

    // ---------- Рендеринг ----------
    function render(posts) {
        container.innerHTML = "";
        if (!posts.length) {
            container.innerHTML = '<div class="tg-loading">Пока нет постов 😴</div>';
            return;
        }
        posts.slice(0, MAX_POSTS).forEach(function (post) {
            var el = document.createElement("div");
            el.className = "tg-message";

            var p = document.createElement("p");
            p.className = "tg-text";
            p.innerHTML = post.html ? sanitizeHtml(post.html) : escapeHtml(post.text);

            var span = document.createElement("span");
            span.className = "tg-date";
            span.textContent = post.date;

            el.appendChild(p);
            el.appendChild(span);
            container.appendChild(el);
        });
    }

    function showDemo() {
        render(DEMO_POSTS);
    }

    // ---------- Загрузка реальных постов (JSONP) ----------
    function loadRealPosts() {
        window.__tgWidgetCallback = function (data) {
            var posts = [];
            try {
                (data.messages || data.result || []).forEach(function (m) {
                    posts.push({
                        html: m.text || "",
                        date: m.date ? formatDate(m.date) : ""
                    });
                });
            } catch (e) { /* игнорируем кривые данные */ }
            if (posts.length) render(posts);
            else showDemo();
        };

        var url = "https://api.telegram.org/widget/getMessages/" +
                  encodeURIComponent(TG_USERNAME) + "/" +
                  encodeURIComponent(TG_HASH) +
                  "?limit=" + MAX_POSTS + "&callback=__tgWidgetCallback";

        var s = document.createElement("script");
        s.src = url;
        s.onerror = function () { showDemo(); }; // сеть недоступна — показываем демо
        document.body.appendChild(s);
    }

    // ---------- Старт ----------
    if (TG_HASH) {
        loadRealPosts();
    } else {
        showDemo();
    }
})();
