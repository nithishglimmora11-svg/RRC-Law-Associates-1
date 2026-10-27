const currentScriptEl = document.currentScript;
const rrcAssistantOnly = currentScriptEl?.hasAttribute('data-rrc-ai-only') === true;
let rrcScriptVersion = '20261008-1';
try {
  const currentSrc = currentScriptEl?.src;
  if (currentSrc) {
    const v = new URL(currentSrc, document.baseURI).searchParams.get('v');
    if (v) rrcScriptVersion = v;
  }
} catch { /* use default version */ }

function createLucideIcons() {
  if (typeof window.lucide?.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function initRrcAiAssistant() {
  if (window.__rrcAiAssistantMounted === true) return;
  const mount = document.querySelector('[data-rrc-ai-chat-root]');
  if (!document.body || !mount) return;
  if (mount.querySelector('.rrc-ai-chat') || document.querySelector('.rrc-ai-chat')) return;

  const host = document.createElement('div');
  host.className = 'rrc-ai-chat';
  // Immediate light-DOM positioning: keeps the host out of normal document
  // flow even before any stylesheet has loaded.
  host.style.position = 'fixed';
  host.style.right = '20px';
  host.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + 84px)';
  host.style.width = '60px';
  host.style.height = '60px';
  host.style.margin = '0';
  host.style.padding = '0';
  host.style.zIndex = '1500';
  host.style.display = 'block';
  host.style.pointerEvents = 'auto';
  const root = host.attachShadow({ mode: 'open' });

  // Self-contained, synchronous Shadow DOM styling: embeds the full widget styles
  // directly so the assistant is fully styled immediately, immune to network
  // latency, cache mismatches, ad-blockers, or stylesheet load failures.
  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      position: fixed !important;
      right: 20px !important;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 84px) !important;
      width: 60px !important;
      height: 60px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      z-index: 1500 !important;
      box-sizing: border-box !important;
      color: #171717 !important;
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.45 !important;
      pointer-events: none !important;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    button, textarea, a {
      font: inherit;
    }
    .rrc-ai-toggle {
      position: absolute !important;
      right: 0 !important;
      bottom: 0 !important;
      display: grid !important;
      place-items: center !important;
      width: 60px !important;
      height: 60px !important;
      padding: 0 !important;
      border: 2px solid #e4c36f !important;
      border-radius: 50% !important;
      background: #111 !important;
      color: #f2d27e !important;
      box-shadow: 0 5px 18px rgba(0, 0, 0, 0.28) !important;
      font-size: 17px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease !important;
    }
    .rrc-ai-toggle:hover {
      transform: translateY(-3px) !important;
      background: #292929 !important;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.32) !important;
    }
    .rrc-ai-toggle:focus-visible,
    button:focus-visible,
    a:focus-visible,
    .rrc-ai-input:focus-visible {
      outline: 3px solid #b58a2a !important;
      outline-offset: 3px !important;
    }
    .rrc-ai-window {
      position: absolute !important;
      right: 0 !important;
      bottom: 70px !important;
      display: flex !important;
      flex-direction: column !important;
      width: min(380px, calc(100vw - 32px)) !important;
      height: min(490px, calc(100dvh - 280px)) !important;
      max-height: calc(100dvh - 270px) !important;
      min-height: min(320px, calc(100dvh - 270px)) !important;
      overflow: hidden !important;
      border: 1px solid rgba(201, 162, 77, 0.55) !important;
      border-radius: 8px !important;
      background: #fff !important;
      color: #191919 !important;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.24) !important;
      pointer-events: none !important;
      transform: translateY(8px) !important;
      transform-origin: bottom right !important;
      transition: transform 180ms ease, opacity 180ms ease !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
    .rrc-ai-window.rrc-ai-visible {
      pointer-events: auto !important;
      transform: translateY(0) !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    .rrc-ai-header {
      display: flex !important;
      flex: 0 0 auto !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
      min-height: 56px !important;
      padding: 10px 14px !important;
      background: #111 !important;
      color: #fff !important;
    }
    .rrc-ai-icon {
      flex: 0 0 34px !important;
      width: 34px !important;
      height: 34px !important;
      padding: 2px !important;
      border-radius: 6px !important;
      background: #f9f7f3 !important;
      object-fit: contain !important;
    }
    .rrc-ai-heading-group {
      display: flex !important;
      flex: 1 1 auto !important;
      flex-direction: column !important;
      gap: 2px !important;
      min-width: 0 !important;
    }
    .rrc-ai-title {
      display: block !important;
      min-width: 0 !important;
      overflow: hidden !important;
      color: #f1d27c !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
    .rrc-ai-status {
      color: #d8ded8 !important;
      font-size: 11px !important;
    }
    .rrc-ai-status::before {
      display: inline-block !important;
      width: 7px !important;
      height: 7px !important;
      margin-right: 6px !important;
      border-radius: 50% !important;
      background: #55bd78 !important;
      content: "" !important;
    }
    .rrc-ai-close,
    .rrc-ai-refresh {
      display: grid !important;
      flex: 0 0 32px !important;
      place-items: center !important;
      width: 32px !important;
      height: 32px !important;
      padding: 0 !important;
      border: 1px solid rgba(255, 255, 255, 0.28) !important;
      border-radius: 50% !important;
      background: transparent !important;
      color: #fff !important;
      cursor: pointer !important;
      transition: background-color 150ms ease !important;
    }
    .rrc-ai-close {
      font-size: 22px !important;
      line-height: 1 !important;
    }
    .rrc-ai-refresh {
      font-size: 18px !important;
      line-height: 1 !important;
    }
    .rrc-ai-refresh:hover,
    .rrc-ai-close:hover {
      background: rgba(255, 255, 255, 0.14) !important;
    }
    .rrc-ai-actions {
      display: flex !important;
      flex: 0 0 auto !important;
      gap: 8px !important;
      padding: 8px 12px !important;
      border-bottom: 1px solid #ece7dc !important;
      background: #faf8f2 !important;
    }
    .rrc-ai-action {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 30px !important;
      padding: 4px 10px !important;
      border: 1px solid #c9a24d !important;
      border-radius: 4px !important;
      background: #fff !important;
      color: #191919 !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      text-decoration: none !important;
      transition: background-color 150ms ease !important;
    }
    .rrc-ai-action:hover {
      background: #f1e6c8 !important;
    }
    .rrc-ai-messages {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      overflow-y: auto !important;
      padding: 12px 12px 8px !important;
      overscroll-behavior: contain !important;
    }
    .rrc-ai-welcome {
      margin: 0 0 10px !important;
      padding: 10px 12px !important;
      border: 1px solid #eee7d8 !important;
      border-radius: 6px !important;
      background: #faf8f2 !important;
      color: #292929 !important;
      font-size: 13px !important;
      line-height: 1.48 !important;
      white-space: pre-line !important;
    }
    .rrc-ai-quick-questions {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
      margin: 0 0 10px !important;
    }
    .rrc-ai-quick-question {
      min-height: 28px !important;
      padding: 4px 9px !important;
      border: 1px solid #d7c18a !important;
      border-radius: 14px !important;
      background: #fff !important;
      color: #28231a !important;
      font-size: 11px !important;
      cursor: pointer !important;
      transition: background-color 150ms ease !important;
    }
    .rrc-ai-quick-question:hover:not(:disabled) {
      background: #f7f0df !important;
    }
    .rrc-ai-message {
      width: fit-content !important;
      max-width: 90% !important;
      margin: 8px 0 !important;
      padding: 8px 11px !important;
      border-radius: 7px !important;
      color: #252525 !important;
      font-size: 13px !important;
      line-height: 1.5 !important;
      overflow-wrap: anywhere !important;
      white-space: pre-wrap !important;
    }
    .rrc-ai-user {
      margin-left: auto !important;
      background: #171717 !important;
      color: #fff !important;
    }
    .rrc-ai-assistant {
      margin-right: auto !important;
      border: 1px solid #eadcb5 !important;
      background: #fbf8ef !important;
    }
    .rrc-ai-thinking {
      color: #565147 !important;
      font-style: italic !important;
    }
    .rrc-ai-live-status {
      flex: 0 0 auto !important;
      min-height: 16px !important;
      padding: 0 12px !important;
      color: #7e2c22 !important;
      font-size: 11px !important;
    }
    .rrc-ai-form {
      display: flex !important;
      flex: 0 0 auto !important;
      align-items: flex-end !important;
      gap: 8px !important;
      padding: 8px 12px !important;
      border-top: 1px solid #eee7d8 !important;
    }
    .rrc-ai-sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
      clip-path: inset(50%) !important;
    }
    .rrc-ai-input {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      min-height: 40px !important;
      max-height: 90px !important;
      resize: vertical !important;
      padding: 8px 10px !important;
      border: 1px solid #cfc9bb !important;
      border-radius: 5px !important;
      background: #fff !important;
      color: #191919 !important;
      font-size: 13px !important;
      line-height: 1.4 !important;
    }
    .rrc-ai-send {
      flex: 0 0 auto !important;
      min-height: 40px !important;
      padding: 0 14px !important;
      border: 1px solid #111 !important;
      border-radius: 5px !important;
      background: #111 !important;
      color: #f1d27c !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      transition: background-color 150ms ease !important;
    }
    .rrc-ai-send:hover:not(:disabled) {
      background: #333 !important;
    }
    button:disabled,
    .rrc-ai-input:disabled {
      cursor: not-allowed !important;
      opacity: 0.65 !important;
    }
    .rrc-ai-disclaimer {
      flex: 0 0 auto !important;
      margin: 0 !important;
      padding: 0 12px 10px !important;
      color: #625e55 !important;
      font-size: 10px !important;
      line-height: 1.4 !important;
    }
    @media (max-width: 600px) {
      :host {
        right: 16px !important;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 76px) !important;
        width: 52px !important;
        height: 52px !important;
      }
      .rrc-ai-toggle {
        width: 52px !important;
        height: 52px !important;
        font-size: 15px !important;
      }
      .rrc-ai-title {
        font-size: 13px !important;
        overflow: visible !important;
        text-overflow: clip !important;
        white-space: normal !important;
      }
      .rrc-ai-window {
        bottom: 64px !important;
        width: min(360px, calc(100vw - 32px)) !important;
        height: min(380px, calc(100dvh - 275px)) !important;
        max-height: calc(100dvh - 265px) !important;
        min-height: min(260px, calc(100dvh - 265px)) !important;
      }
    }
    @media (max-height: 520px) {
      .rrc-ai-window {
        bottom: 58px !important;
        height: calc(100dvh - 160px) !important;
        min-height: 0 !important;
      }
      .rrc-ai-header {
        min-height: 48px !important;
        gap: 8px !important;
        padding: 4px 10px !important;
      }
      .rrc-ai-icon {
        flex-basis: 26px !important;
        width: 26px !important;
        height: 26px !important;
      }
      .rrc-ai-close,
      .rrc-ai-refresh {
        flex-basis: 28px !important;
        width: 28px !important;
        height: 28px !important;
      }
      .rrc-ai-actions {
        gap: 6px !important;
        padding: 2px 10px !important;
      }
      .rrc-ai-form {
        gap: 6px !important;
        padding: 4px 10px 5px !important;
      }
      .rrc-ai-input {
        min-height: 32px !important;
        padding: 4px 6px !important;
        font-size: 12px !important;
      }
      .rrc-ai-send {
        min-height: 32px !important;
        padding: 0 10px !important;
      }
      .rrc-ai-disclaimer {
        padding: 0 8px 4px !important;
        font-size: 9px !important;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .rrc-ai-toggle,
      .rrc-ai-window {
        transition: none !important;
      }
    }
  `;
  root.appendChild(style);

  // Fallback / complement external stylesheet with synchronized versioning
  let aiStyleVersion = rrcScriptVersion;
  if (!aiStyleVersion || aiStyleVersion === '20261008-1') {
    const matchingScript = document.querySelector('script[src*="script.js"]');
    if (matchingScript && matchingScript.src) {
      try {
        const v = new URL(matchingScript.src, document.baseURI).searchParams.get('v');
        if (v) aiStyleVersion = v;
      } catch { /* keep default */ }
    }
  }
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL(('/style.css?v=' + (aiStyleVersion || '20261008-1')), window.location.origin).href;
  root.appendChild(stylesheet);

  const makeElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const toggle = makeElement('button', 'rrc-ai-toggle', 'AI');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open RRC Law Associates AI Assistant');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'rrc-ai-window');

  const panel = makeElement('section', 'rrc-ai-window');
  panel.id = 'rrc-ai-window';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'RRC Law Associates AI Assistant');
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;

  const header = makeElement('header', 'rrc-ai-header');
  const brandIcon = makeElement('img', 'rrc-ai-icon');
  brandIcon.src = new URL('/assets/images/logo.png', window.location.origin).href;
  brandIcon.alt = '';
  brandIcon.setAttribute('aria-hidden', 'true');

  const headingGroup = makeElement('div', 'rrc-ai-heading-group');
  headingGroup.append(
    makeElement('strong', 'rrc-ai-title', 'RRC Law Associates AI Assistant')
  );
  const status = makeElement('span', 'rrc-ai-status', 'Online');
  headingGroup.appendChild(status);
  const refreshButton = makeElement('button', 'rrc-ai-refresh', '⟳');
  refreshButton.type = 'button';
  refreshButton.setAttribute('aria-label', 'Refresh conversation');
  refreshButton.setAttribute('title', 'Refresh conversation');
  const closeButton = makeElement('button', 'rrc-ai-close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close AI Assistant');
  header.append(brandIcon, headingGroup, refreshButton, closeButton);

  const actions = makeElement('nav', 'rrc-ai-actions');
  actions.setAttribute('aria-label', 'Contact and consultation links');
  const bookingLink = makeElement('a', 'rrc-ai-action', 'Book Consultation');
  bookingLink.href = '/booking.html';
  actions.append(bookingLink);

  const WELCOME_LINES = [
    'Hello! 👋',
    'I’m the RRC Law Associates AI Assistant.',
    '',
    'I can help you learn more about:',
    '• NRI legal services',
    '• Property and family matters',
    '• Child custody',
    '• Power of Attorney',
    '• Litigation and dispute resolution',
    '• Cyber and employment matters',
    '• Documentation and due diligence',
    '• Booking a consultation',
    '',
    'How can I help you?'
  ];
  const QUICK_QUESTION_LABELS = [
    'NRI Legal Services',
    'Property Matters',
    'Child Custody',
    'Power of Attorney',
    'Book Consultation'
  ];

  const messages = makeElement('div', 'rrc-ai-messages');
  messages.setAttribute('role', 'log');
  messages.setAttribute('aria-label', 'Chat messages');
  messages.setAttribute('aria-live', 'polite');
  messages.setAttribute('aria-relevant', 'additions');

  const welcome = makeElement('p', 'rrc-ai-welcome');
  welcome.textContent = WELCOME_LINES.join('\n');
  messages.appendChild(welcome);

  const quickQuestions = makeElement('div', 'rrc-ai-quick-questions');
  quickQuestions.setAttribute('role', 'group');
  quickQuestions.setAttribute('aria-label', 'Quick questions');
  const quickQuestionLabels = QUICK_QUESTION_LABELS.slice();
  const quickButtons = quickQuestionLabels.map((label) => {
    const button = makeElement('button', 'rrc-ai-quick-question', label);
    button.type = 'button';
    quickQuestions.appendChild(button);
    return button;
  });
  messages.appendChild(quickQuestions);

  const liveStatus = makeElement('div', 'rrc-ai-live-status');
  liveStatus.setAttribute('role', 'status');
  liveStatus.setAttribute('aria-live', 'polite');

  const form = makeElement('form', 'rrc-ai-form');
  const inputLabel = makeElement('label', 'rrc-ai-sr-only', 'Your message');
  inputLabel.htmlFor = 'rrc-ai-input';
  const input = makeElement('textarea', 'rrc-ai-input');
  input.id = 'rrc-ai-input';
  input.rows = 2;
  input.maxLength = 1200;
  input.placeholder = 'Type your message...';
  input.setAttribute('aria-label', 'Type your message');
  const sendButton = makeElement('button', 'rrc-ai-send', 'Send');
  sendButton.type = 'submit';
  sendButton.setAttribute('aria-label', 'Send message');
  form.append(inputLabel, input, sendButton);

  const disclaimer = makeElement(
    'p',
    'rrc-ai-disclaimer',
    'AI-generated responses are for general information only and are not legal advice. Do not share confidential or sensitive personal information through this chat.'
  );

  panel.append(header, actions, messages, liveStatus, form, disclaimer);
  root.append(toggle, panel);
  mount.appendChild(host);
  window.__rrcAiAssistantMounted = true;

  let isSending = false;
  let isOpen = false;
  let conversationResetToken = 0;

  function resetConversation() {
    // Start a fresh conversation: invalidate in-flight responses, clear
    // transient loading/error state, drop rendered messages, and restore
    // the initial welcome + quick questions. Frontend keeps no persisted
    // chat history (no chat localStorage/sessionStorage), so clearing the
    // DOM plus these flags fully resets client conversation state.
    conversationResetToken += 1;
    const activeToken = conversationResetToken;
    isSending = false;
    input.value = '';
    input.disabled = false;
    sendButton.disabled = false;
    quickButtons.forEach((button) => { button.disabled = false; });
    liveStatus.textContent = '';
    messages.replaceChildren();
    const freshWelcome = makeElement('p', 'rrc-ai-welcome');
    freshWelcome.textContent = WELCOME_LINES.join('\n');
    messages.appendChild(freshWelcome);
    messages.appendChild(quickQuestions);
    messages.scrollTop = 0;
    liveStatus.textContent = 'Conversation refreshed. How can I help you?';
    window.setTimeout(() => {
      if (activeToken === conversationResetToken) liveStatus.textContent = '';
    }, 2500);
    if (isOpen) input.focus();
  }

  function setOpen(open) {
    isOpen = open;
    host.classList.toggle('rrc-ai-open', open);
    panel.classList.toggle('rrc-ai-visible', open);
    toggle.setAttribute('aria-label', open ? 'Close RRC Law Associates AI Assistant' : 'Open RRC Law Associates AI Assistant');
    toggle.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    if (open) {
      requestAnimationFrame(() => input.focus());
    } else {
      toggle.focus();
    }
  }

  function addMessage(role, text) {
    const message = makeElement('div', `rrc-ai-message rrc-ai-${role}`);
    message.setAttribute('aria-label', role === 'user' ? 'You' : 'AI Assistant');
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  }

  async function sendMessage(rawMessage, fromInput) {
    const userMessage = rawMessage.trim();
    if (!userMessage) {
      liveStatus.textContent = 'Please enter a message.';
      if (fromInput && isOpen) input.focus();
      return;
    }
    if (isSending) return;
    const requestToken = conversationResetToken;

    isSending = true;
    liveStatus.textContent = 'Sending your message.';
    if (fromInput) input.value = '';
    input.disabled = true;
    sendButton.disabled = true;
    quickButtons.forEach((button) => { button.disabled = true; });
    addMessage('user', userMessage);
    const thinking = addMessage('thinking', 'Thinking...');

    try {
      const hostname = window.location.hostname;
      const usesProductionApi = ['localhost', '127.0.0.1', 'www.rrclawassociates.com'].includes(hostname);
      const chatEndpoint = usesProductionApi
        ? 'https://rrclawassociates.com/api/chat'
        : '/api/chat';
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      if (!response.ok) {
        const messagesByStatus = {
          400: 'Please check your message and try again.',
          429: 'Too many requests. Please wait a moment and try again.',
          500: 'The assistant is temporarily unavailable. Please try again later.',
          502: 'The assistant could not complete your request. Please try again later.',
          503: 'The assistant is temporarily unavailable. Please try again later.'
        };
        addMessage(
          'assistant',
          messagesByStatus[response.status] || 'Sorry, I’m unable to respond right now. Please try again later.'
        );
        return;
      }
      const result = await response.json();
      if (requestToken !== conversationResetToken) return;
      if (result?.success !== true || typeof result.message !== 'string' || !result.message.trim()) {
        throw new Error('Assistant request failed');
      }
      addMessage('assistant', result.message);
    } catch {
      if (requestToken !== conversationResetToken) return;
      addMessage(
        'assistant',
        'Sorry, I’m unable to respond right now. Please try again or contact RRC Law Associates directly.'
      );
    } finally {
      if (requestToken !== conversationResetToken) return;
      thinking.remove();
      isSending = false;
      input.disabled = false;
      sendButton.disabled = false;
      quickButtons.forEach((button) => { button.disabled = false; });
      liveStatus.textContent = '';
      if (isOpen) input.focus();
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen));
  refreshButton.addEventListener('click', resetConversation);
  closeButton.addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value, true);
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  quickButtons.forEach((button) => {
    button.addEventListener('click', () => sendMessage(button.textContent, false));
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) setOpen(false);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRrcAiAssistant, { once: true });
} else {
  initRrcAiAssistant();
}

if (!rrcAssistantOnly) {
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const btn = document.getElementById("submitBtn");

  if (form && toast && btn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      btn.innerText = "Submitting...";
      btn.disabled = true;

      setTimeout(() => {
        toast.style.opacity = "1";
        toast.innerText = "Consultation Request Submitted";

        form.reset();
        btn.innerText = "Submit Request";
        btn.disabled = false;

        setTimeout(() => {
          toast.style.opacity = "0";
        }, 3000);
      }, 1000);
    });
  }

// footer
// Set current year safely
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Initialize Lucide icons
createLucideIcons();

// Smooth scroll for old elements that used data-link
document.querySelectorAll("[data-link]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.link);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove("open");
        mobileMenu.classList.remove("active");
    }
  });
});
}

// Global mobile menu navigation (runs on all pages including articles)
function initMobileNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    // Initial accessibility state
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    // Open Mobile Menu
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.add('open');
            mobileMenu.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
        });
    }

    // Close Mobile Menu (X button)
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close Menu on Background Click
    document.addEventListener('click', (e) => {
        if (mobileMenu && (mobileMenu.classList.contains('open') || mobileMenu.classList.contains('active'))) {
            if (!mobileMenu.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });

    // Close Menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && (mobileMenu.classList.contains('open') || mobileMenu.classList.contains('active'))) {
            mobileMenu.classList.remove('open');
            mobileMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        }
    });

    // Mobile submenu accordion toggles (.m-trigger)
    document.querySelectorAll('.m-trigger').forEach(trigger => {
        if (trigger.dataset.boundMTrigger) return;
        trigger.dataset.boundMTrigger = 'true';
        trigger.addEventListener('click', function(e) {
            const submenu = this.nextElementSibling;
            if (!submenu) return;

            if (!submenu.classList.contains('active')) {
                e.preventDefault();
                document.querySelectorAll('.m-submenu').forEach(m => m.classList.remove('active'));
                document.querySelectorAll('.m-trigger i').forEach(i => i.style.transform = 'rotate(0deg)');

                submenu.classList.add('active');
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNavigation);
} else {
    initMobileNavigation();
}

if (!rrcAssistantOnly) {
// hero section
createLucideIcons();

// Smooth scroll
document.querySelectorAll("[data-link]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.link);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
//ptactice section
createLucideIcons();

//testimonial
createLucideIcons();

const testimonials = [
  {
    name: "Ramesh Krishnan",
    location: "Chennai",
    text: "The team at Advocate Law Firm handled my property dispute with exceptional professionalism. Their expertise delivered a favorable judgment.",
    rating: 5,
  },
  {
    name: "Meena Sundaram",
    location: "Coimbatore",
    text: "The advocates guided me through a difficult divorce with empathy and clarity. Truly client-focused and professional.",
    rating: 5,
  },
  {
    name: "Karthik Rajan",
    location: "Madurai",
    text: "Their strategic corporate advice saved my business during a major dispute. Highly recommended.",
    rating: 5,
  },
  {
    name: "Anjali Venkat",
    location: "Trichy",
    text: "They handled my consumer complaint efficiently and secured full compensation. Excellent service!",
    rating: 5,
  },
];

let index = 0;

const text = document.getElementById("testimonialText");
const nameEl = document.getElementById("name");
const locationEl = document.getElementById("location");
const starsEl = document.getElementById("stars");
const dotsEl = document.getElementById("dots");

function render() {
  const t = testimonials[index];

  text.style.animation = "none";
  void text.offsetWidth;
  text.style.animation = "fadeSlide 0.6s forwards";

  text.textContent = `"${t.text}"`;
  nameEl.textContent = t.name;
  locationEl.textContent = t.location;

  starsEl.innerHTML = "";
  [...Array(t.rating)].forEach(() => {
    const star = document.createElement("span");
    star.textContent = "★";
    starsEl.appendChild(star);
  });

  dotsEl.innerHTML = "";
  testimonials.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === index) dot.classList.add("active");
    dot.onclick = () => { index = i; render(); };
    dotsEl.appendChild(dot);
  });
}

const nextButton = document.querySelector(".next");
if (nextButton) {
  nextButton.onclick = () => {
    index = (index + 1) % testimonials.length;
    render();
  };
}

const prevButton = document.querySelector(".prev");
if (prevButton) {
  prevButton.onclick = () => {
    index = (index - 1 + testimonials.length) % testimonials.length;
    render();
  };
}

if (text && nameEl && locationEl && starsEl && dotsEl) {
  render();
}
//stats scroll


//testimonial scroll
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".testimonial-slider");
  const slides = document.querySelectorAll(".testimonial-slide");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  // Safety check: component is optional across pages
  if (!slider) {
    return;
  }
  if (slides.length === 0) {
    console.warn("Testimonial slider element found but contains no slides");
    return;
  }

  let index = 0;
  const gap = 40; // must match CSS gap
  const autoDelay = 8000; // 8 seconds (recommended)

  function updateSlider() {
    const slideWidth = slides[0].offsetWidth + gap;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  // NEXT button
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      updateSlider();
      resetAutoScroll();
    });
  }

  // PREV button
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      updateSlider();
      resetAutoScroll();
    });
  }

  // AUTO SCROLL
  let autoScroll = setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
  }, autoDelay);

  // Reset auto scroll on interaction
  function resetAutoScroll() {
    clearInterval(autoScroll);
    autoScroll = setInterval(() => {
      index = (index + 1) % slides.length;
      updateSlider();
    }, autoDelay);
  }

  // Update on resize
  window.addEventListener("resize", updateSlider);

  // Initial position
  updateSlider();
});

//testimonial


//conatct section
const reveals = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("active");
      }
    });
  },
  { threshold:0.2 }
);

reveals.forEach(el => observer.observe(el));


//footer
createLucideIcons();

// Dynamic year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

//changable gif for experience
const icons = [
  "icons/award.gif",
  "icons/scale.gif",
  "icons/shield.gif"
];

let i = 0;
const iconSwap = document.getElementById("iconSwap");
if (iconSwap) {
  setInterval(() => {
    i = (i + 1) % icons.length;
    iconSwap.src = icons[i];
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".testimonial-slider");
  const slides = document.querySelectorAll(".testimonial");
  const prevBtn = document.querySelector(".test.prev");
  const nextBtn = document.querySelector(".test.next");

  if (!slider) {
    return;
  }
  if (slides.length === 0) {
    console.warn("Slider container found but has no testimonial slides");
    return;
  }

  let index = 0;
  const gap = 40;

  function updateSlider() {
    const slideWidth = slides[0].offsetWidth + gap;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  nextBtn?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlider();
  });

  prevBtn?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
  });

  // AUTO SCROLL (slow & premium)
  setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
  }, 8000);

  window.addEventListener("resize", updateSlider);
});

window.addEventListener("load", () => {

  const counters = document.querySelectorAll(".stat-card h3");

  counters.forEach(counter => {
    const text = counter.textContent.trim();
    const number = parseInt(text.replace(/\D/g, ""));
    const suffix = text.replace(/[0-9]/g, "");
    let current = 0;

    const increment = Math.max(1, Math.floor(number / 80));

    const updateCount = () => {
      current += increment;

      if (current < number) {
        counter.textContent = current + suffix;
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = number + suffix;
      }
    };

    updateCount();
  });

});


// Function to accept disclaimer
window.acceptDisclaimer = function acceptDisclaimer() {
    localStorage.setItem("disclaimerAccepted", "yes"); // store in localStorage
    document.getElementById("disclaimerOverlay").style.display = "none"; // hide popup
};

// Function to close popup without accepting
window.closeDisclaimer = function closeDisclaimer() {
    document.getElementById("disclaimerOverlay").style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("advocatesGrid");
    const cards = document.querySelectorAll(".advocate-card");
    const prevBtn = document.querySelector(".adv-prev");
    const nextBtn = document.querySelector(".adv-next");

    let currentIndex = 0;
    const gap = 24;
    const autoDelay = 5000; // 5 seconds per slide
    let autoScrollInterval;

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + gap;
        grid.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function moveNext() {
        const visibleCards = window.innerWidth > 968 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        if (currentIndex < cards.length - visibleCards) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to the first advocate
        }
        updateSlider();
    }

    function movePrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            const visibleCards = window.innerWidth > 968 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            currentIndex = cards.length - visibleCards;
        }
        updateSlider();
    }

  }); 

  
    document.addEventListener('DOMContentLoaded', function() {
    // Select the Practice Areas link
    const practiceLink = document.querySelector('.dropdown-toggle[href="nri-services.html"]');

    if (practiceLink && window.innerWidth > 992) {
        practiceLink.addEventListener('click', function(e) {
            // Redirect to the page immediately on click
            window.location.href = this.getAttribute('href');
        });
    }
});

    document.addEventListener('DOMContentLoaded', function() {
    // Select the Practice Areas link
    const practiceLink = document.querySelector('.dropdown-toggle[href="sectors.html"]');

    if (practiceLink && window.innerWidth > 992) {
        practiceLink.addEventListener('click', function(e) {
            // Redirect to the page immediately on click
            window.location.href = this.getAttribute('href');
        });
    }
});

    document.addEventListener('DOMContentLoaded', function() {
    // Select the Practice Areas link
    const practiceLink = document.querySelector('.dropdown-toggle[href="core-practice-areas.html"]');

    if (practiceLink && window.innerWidth > 992) {
        practiceLink.addEventListener('click', function(e) {
            // Redirect to the page immediately on click
            window.location.href = this.getAttribute('href');
        });
    }
});
}