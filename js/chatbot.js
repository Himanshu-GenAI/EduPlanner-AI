/* ================================================================
   AI STUDY PLANNER — SELF-CONTAINED AI CHAT ASSISTANT
   Dynamically Injected floating UI, Quick Actions, Pre-set Knowledge
   ================================================================ */

(function initChatbot() {
    // 1. Inject Chatbot Styles
    const style = document.createElement('style');
    style.textContent = `
        .chatbot-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 2000;
            font-family: var(--font-sans);
        }
        .chatbot-fab {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--green-500), var(--green-700));
            color: var(--white);
            border: none;
            box-shadow: 0 4px 16px rgba(5, 150, 105, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }
        .chatbot-fab:hover {
            transform: scale(1.1) rotate(10deg);
            box-shadow: 0 6px 20px rgba(5, 150, 105, 0.5);
        }
        .chatbot-fab svg {
            width: 26px;
            height: 26px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2.2;
        }
        .chatbot-panel {
            position: absolute;
            bottom: 72px;
            right: 0;
            width: 360px;
            height: 480px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-2xl);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.3s var(--ease-spring);
        }
        .chatbot-panel.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }
        .chatbot-header {
            background: linear-gradient(135deg, var(--green-600), var(--green-800));
            color: var(--white);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .chatbot-header .avatar-icon {
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chatbot-header .title-info h4 {
            font-size: 0.95rem;
            font-weight: 700;
        }
        .chatbot-header .title-info p {
            font-size: 0.72rem;
            opacity: 0.85;
        }
        .chatbot-header .close-btn {
            margin-left: auto;
            background: none;
            border: none;
            color: var(--white);
            cursor: pointer;
            font-size: 1.4rem;
            line-height: 1;
            padding: 4px;
        }
        .chatbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: var(--bg-secondary);
        }
        .chat-msg {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: var(--radius-md);
            font-size: 0.88rem;
            line-height: 1.5;
            animation: scaleIn 0.2s var(--ease) both;
        }
        .chat-msg.bot {
            background: var(--bg-primary);
            color: var(--text-primary);
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            border: 1px solid var(--border-color);
        }
        .chat-msg.user {
            background: var(--green-600);
            color: var(--white);
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }
        .chatbot-chips {
            display: flex;
            gap: 6px;
            padding: 8px 16px;
            overflow-x: auto;
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-color);
            white-space: nowrap;
        }
        .chatbot-chips::-webkit-scrollbar {
            display: none;
        }
        .chip {
            background: var(--bg-primary);
            border: 1.2px solid var(--green-300);
            color: var(--green-700);
            padding: 5px 12px;
            font-size: 0.78rem;
            font-weight: 600;
            border-radius: var(--radius-full);
            cursor: pointer;
            transition: var(--transition);
        }
        .chip:hover {
            background: var(--green-500);
            color: var(--white);
            border-color: var(--green-500);
        }
        .chatbot-input {
            display: flex;
            border-top: 1px solid var(--border-color);
            padding: 12px;
            background: var(--bg-primary);
        }
        .chatbot-input input {
            flex: 1;
            border: none;
            outline: none;
            padding: 8px 12px;
            font-size: 0.88rem;
            background: transparent;
            color: var(--text-primary);
        }
        .chatbot-input button {
            background: var(--green-600);
            color: var(--white);
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition);
        }
        .chatbot-input button:hover {
            background: var(--green-700);
        }
        .chatbot-input button svg {
            width: 16px;
            height: 16px;
        }
        
        /* Typing Dots */
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 8px 12px;
            align-items: center;
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            background: var(--text-tertiary);
            border-radius: 50%;
            animation: bounceDot 0.6s infinite alternate;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounceDot {
            to { transform: translateY(-4px); }
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML Markup
    const container = document.createElement('div');
    container.className = 'chatbot-container no-print';
    container.innerHTML = `
        <button class="chatbot-fab" id="chatbot-fab" title="Ask AI Study Assistant">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
        </button>
        <div class="chatbot-panel" id="chatbot-panel">
            <div class="chatbot-header">
                <div class="avatar-icon">
                    <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div class="title-info">
                    <h4>StudyAI Copilot</h4>
                    <p>Always active helper</p>
                </div>
                <button class="close-btn" id="chatbot-close">&times;</button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages"></div>
            <div class="chatbot-chips">
                <button class="chip" data-query="Study Tips">Study Tips 💡</button>
                <button class="chip" data-query="Plan My Day">Plan My Day 📅</button>
                <button class="chip" data-query="Motivation">Motivation 🚀</button>
                <button class="chip" data-query="Help">Help 🔍</button>
            </div>
            <div class="chatbot-input">
                <input type="text" id="chatbot-input-field" placeholder="Ask StudyAI..." autocomplete="off">
                <button id="chatbot-send-btn" title="Send Message">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. UI Selectors & Listeners
    const fab = document.getElementById('chatbot-fab');
    const panel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const chips = document.querySelectorAll('.chatbot-chips .chip');

    // Load Chat History from SessionStorage
    let chatHistory = JSON.parse(sessionStorage.getItem('chatbot_history')) || [
        { sender: 'bot', text: "Hi there! I'm StudyAI, your virtual learning coach. Ask me about study strategies, Pomodoro intervals, how to generate a schedule, or request some motivation!" }
    ];

    function renderHistory() {
        messagesContainer.innerHTML = '';
        chatHistory.forEach(msg => {
            appendMessage(msg.sender, msg.text, false);
        });
        scrollToBottom();
    }

    function saveHistory() {
        sessionStorage.setItem('chatbot_history', JSON.stringify(chatHistory));
    }

    fab.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open') && chatHistory.length === 1) {
            renderHistory();
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    // Send handlers
    sendBtn.addEventListener('click', handleUserSubmit);
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleUserSubmit();
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-query');
            handleInput(query);
        });
    });

    function handleUserSubmit() {
        const text = inputField.value.trim();
        if (!text) return;
        inputField.value = '';
        handleInput(text);
    }

    function handleInput(text) {
        // Append user message
        appendMessage('user', text);
        chatHistory.push({ sender: 'user', text });
        saveHistory();

        // Show typing indicator
        showTypingIndicator();

        // Calculate Bot response delay
        setTimeout(() => {
            removeTypingIndicator();
            const reply = getAIResponse(text);
            appendMessage('bot', reply);
            chatHistory.push({ sender: 'bot', text: reply });
            saveHistory();
        }, 1200);
    }

    function appendMessage(sender, text, animate = true) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.textContent = text;
        if (!animate) {
            msg.style.animation = 'none';
        }
        messagesContainer.appendChild(msg);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-msg bot typing-indicator';
        indicator.id = 'bot-typing';
        indicator.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('bot-typing');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Knowledge Base Router
    function getAIResponse(query) {
        const q = query.toLowerCase();
        
        // 1. Study Tips / Techniques
        if (q.includes('tip') || q.includes('study') || q.includes('technique') || q.includes('method')) {
            const tips = [
                "1. Spaced Repetition: Review topics 1 day, 3 days, and 7 days after learning to lock them in long-term memory.",
                "2. Active Recall: Test yourself with flashcards rather than re-reading notes passively.",
                "3. Feynman Technique: Try explaining the concept in simple terms to a virtual student. If you get stuck, study that part again.",
                "4. Study in blocks: Match difficult topics with your peak alertness hours."
            ];
            return "Here are my top study methods:\n\n" + tips.join("\n\n");
        }
        
        // 2. Planning/Generator instruction
        if (q.includes('plan') || q.includes('schedule') || q.includes('calendar') || q.includes('generate')) {
            return "To generate a personalized study plan:\n1. Click the 'Study Planner' tab on your sidebar.\n2. Add the subjects you need to prepare for.\n3. Input your available study hours and select subject difficulties.\n4. Enter exam dates so the AI can prioritize close exams.\n5. Click 'Generate AI Timetable' and download your PDF plan!";
        }
        
        // 3. Pomodoro
        if (q.includes('pomodoro') || q.includes('break') || q.includes('time management')) {
            return "The Pomodoro Technique is highly recommended: Study intensely for 25 minutes (no phone, no tabs), then take a 5-minute break to walk or stretch. Repeat 4 times, then take a longer 20-30 minute break. Try logging your hours on the Dashboard!";
        }

        // 4. Motivation
        if (q.includes('motivat') || q.includes('lazy') || q.includes('tired') || q.includes('bored') || q.includes('stress')) {
            const quotes = [
                "Your future self will thank you for the effort you put in today. Let's study for just 20 minutes and see how you feel!",
                "Success isn't overnight. It is the sum of small efforts repeated day in and day out.",
                "Don't wish it were easier; wish you were better. You have the ability to master this subject!",
                "Struggling is a sign of learning. Every mistakes is progress. Keep pushing!"
            ];
            return quotes[Math.floor(Math.random() * quotes.length)];
        }

        // 5. Help / App features
        if (q.includes('help') || q.includes('feature') || q.includes('what') || q.includes('capabilities')) {
            return "I can help you with:\n• Subject-wise planning instructions\n• Spaced repetition strategies\n• Pomodoro and productivity tools explanation\n• Navigating your dashboard analytics and streak trackers\n\nWhat can I assist you with right now?";
        }

        // 6. Generic response
        return "Interesting query! Remember to break down large tasks, study in active recall blocks, and schedule rest. How else can I support your study sessions today?";
    }

    // Run initial history rendering
    renderHistory();
})();
