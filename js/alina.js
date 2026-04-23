/**
 * ALINA AI Assistant - Gymnastics Hub
 * Handling chat UI, logic and automated responses
 */

const AlinaAI = {
    isOpen: false,
    suggestions: [
        { text: '🏆 Найти турнир', action: 'search_tournament' },
        { text: '⛺ Найти сборы', action: 'search_camp' },
        { text: '🎓 Найти семинар', action: 'search_seminar' },
        { text: '➕ Добавить мероприятие', action: 'add_event' },
        { text: '❓ Вопрос о сайте', action: 'site_question' }
    ],

    init() {
        this.injectHTML();
        this.bindEvents();
        console.log('Alina AI Initialized');
    },

    injectHTML() {
        const chatHTML = `
            <div class="ai-chat-window" id="alinaChat">
                <div class="ai-chat-window__header">
                    <div class="alina-avatar">
                        <img src="img/ai-btn.png" alt="Alina">
                    </div>
                    <div class="alina-info">
                        <span class="name">Алина</span>
                        <span class="status">В сети</span>
                    </div>
                    <button class="close-chat" id="closeAlina">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="ai-chat-window__messages" id="alinaMessages">
                    <div class="message message--alina">
                        Привет! Я Алина 👋 Ваш персональный помощник в мире гимнастики. Чем я могу вам помочь сегодня?
                    </div>
                    <div class="quick-suggestions" id="alinaSuggestions">
                        ${this.suggestions.map(s => `<button class="suggest-btn" data-action="${s.action}">${s.text}</button>`).join('')}
                    </div>
                </div>
                <div class="ai-chat-window__input-area">
                    <div class="input-wrapper">
                        <input type="text" id="alinaInput" placeholder="Напишите сообщение...">
                        <button class="send-btn" id="alinaSend">
                            <img src="img/arrow-up-right.svg" alt="Send">
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to widget container if exists, or to body
        let container = document.querySelector('.ai-widget-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'ai-widget-container';
            container.innerHTML = `<a href="#" class="ai-widget" id="alinaTrigger"><img src="img/ai-btn.png" alt="AI"></a>`;
            document.body.appendChild(container);
        } else {
            // If exists, make sure it has the trigger ID
            const trigger = container.querySelector('.ai-widget');
            if (trigger) trigger.id = 'alinaTrigger';
        }
        
        container.insertAdjacentHTML('afterbegin', chatHTML);
    },

    bindEvents() {
        const trigger = document.getElementById('alinaTrigger');
        const closeBtn = document.getElementById('closeAlina');
        const chatWindow = document.getElementById('alinaChat');
        const sendBtn = document.getElementById('alinaSend');
        const input = document.getElementById('alinaInput');
        const suggestions = document.getElementById('alinaSuggestions');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleChat();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleChat(false));
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleSendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSendMessage();
            });
        }

        if (suggestions) {
            suggestions.addEventListener('click', (e) => {
                if (e.target.classList.contains('suggest-btn')) {
                    const action = e.target.dataset.action;
                    const text = e.target.innerText;
                    this.handleAction(action, text);
                }
            });
        }
    },

    toggleChat(force) {
        const chatWindow = document.getElementById('alinaChat');
        const trigger = document.getElementById('alinaTrigger');
        const tooltip = document.querySelector('.ai-tooltip');
        this.isOpen = force !== undefined ? force : !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.add('is-active');
            if (trigger) trigger.style.display = 'none';
            if (tooltip) tooltip.style.display = 'none';
            if (window.lenis) window.lenis.stop();
        } else {
            chatWindow.classList.remove('is-active');
            if (trigger) trigger.style.display = 'flex';
            if (window.lenis) window.lenis.start();
        }
    },

    addMessage(text, type = 'user') {
        const container = document.getElementById('alinaMessages');
        const msg = document.createElement('div');
        msg.className = `message message--${type}`;
        msg.innerHTML = text;
        container.appendChild(msg);
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    },

    handleSendMessage() {
        const input = document.getElementById('alinaInput');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        this.showTypingIndicator();

        // Simulate "Brain" processing
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.getSmartResponse(text);
            this.addMessage(response, 'alina');
        }, 1200);
    },

    showTypingIndicator() {
        const container = document.getElementById('alinaMessages');
        const typing = document.createElement('div');
        typing.className = 'message message--alina typing-indicator';
        typing.id = 'alinaTyping';
        typing.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    },

    removeTypingIndicator() {
        const typing = document.getElementById('alinaTyping');
        if (typing) typing.remove();
    },

    getSmartResponse(text) {
        const input = text.toLowerCase();
        
        // Knowledge Base Mapping
        const kb = [
            { keywords: ['турнир', 'соревнован', 'кубок', 'cup'], response: 'Я нашла несколько интересных 🏆 <strong>турниров</strong> для вас! Посмотрите полный список в нашем <a href="events.html">календаре мероприятий</a>.' },
            { keywords: ['сбор', 'лагерь', 'camp', 'интенсив'], response: '⛺ <strong>Учебно-тренировочные сборы</strong> — отличная возможность для роста! Все актуальные предложения собраны <a href="events.html">здесь</a>.' },
            { keywords: ['семинар', 'мастер-класс', 'урок'], response: '🎓 Повышайте квалификацию на наших <strong>семинарах</strong>. Список доступных занятий <a href="events.html">тут</a>.' },
            { keywords: ['добавить', 'создать', 'разместить', 'опубликовать'], response: '➕ Конечно! Чтобы <strong>добавить свое мероприятие</strong>, просто перейдите на страницу <a href="add-event.html">создания события</a>.' },
            { keywords: ['фото', 'видео', 'галерея', 'медиа'], response: '📸 Вся красота гимнастики собрана в нашей <a href="gallery.html">медиа-галерее</a>. Заходите посмотреть!' },
            { keywords: ['форум', 'тема', 'обсудить', 'вопрос'], response: '💬 На нашем <a href="forum.html">форуме</a> кипит жизнь! Вы можете задать вопрос или начать обсуждение в любой ветке.' },
            { keywords: ['объявлен', 'продать', 'купить', 'вещи', 'купальник'], response: '🛍️ Ищете или продаете экипировку? Загляните в раздел <a href="ads.html">объявлений</a>.' },
            { keywords: ['привет', 'здравствуй', 'добрый'], response: 'Привет! 👋 Я Алина. Я знаю всё о турнирах, сборах и жизни нашего сообщества. О чем хотите узнать?' }
        ];

        for (const item of kb) {
            if (item.keywords.some(k => input.includes(k))) {
                return item.response;
            }
        }

        // Default response if no keywords found
        return 'Хм, интересный вопрос! 🤔 Я пока только учусь, но могу помочь вам найти 🏆 <strong>турнир</strong>, ⛺ <strong>сборы</strong> или рассказать, как ➕ <strong>разместить</strong> своё мероприятие. Что из этого вас интересует?';
    },

    handleAction(action, text) {
        this.addMessage(text, 'user');
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator();
            let response = '';
            switch(action) {
                case 'search_tournament':
                    response = '🏆 Все актуальные <strong>турниры</strong> собраны в нашем <a href="events.html">календаре</a>. Вы можете отфильтровать их по уровню (международные, республиканские).';
                    break;
                case 'search_camp':
                    response = '⛺ <strong>Сборы</strong> — отличный способ подтянуть форму! Посмотрите доступные варианты <a href="events.html">здесь</a>. Мы постоянно добавляем новые локации.';
                    break;
                case 'search_seminar':
                    response = '🎓 Мы проводим регулярные <strong>семинары</strong> для тренеров и судей. Актуальный список <a href="events.html">тут</a>.';
                    break;
                case 'add_event':
                    response = '➕ Вы хотите разместить свое мероприятие? Это просто! Перейдите на страницу <a href="add-event.html">Добавить мероприятие</a> и следуйте пошаговой инструкции.';
                    break;
                case 'site_question':
                    response = '❓ Я с радостью отвечу на вопросы о работе портала. Вас интересует навигация, личный кабинет или как стать нашим партнером?';
                    break;
            }
            this.addMessage(response, 'alina');
        }, 1000);
    },

    /**
     * Future WordPress Integration Example:
     * 
     * async fetchFromWordPress(query) {
     *    const response = await fetch(`/wp-json/gymnasticshub/v1/search?q=${query}`);
     *    const data = await response.json();
     *    return data.html_response;
     * }
     */
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => AlinaAI.init());
