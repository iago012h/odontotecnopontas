/**
 * =========================================================================
 * ODONTO TECNO PONTAS - JAVASCRIPT PRINCIPAL & WIDGET DE CHATBOT (VANILLA JS)
 * =========================================================================
 * 
 * Funcionalidades:
 * 1. Ano dinâmico no rodapé.
 * 2. Menu mobile toggle simples e acessível.
 * 3. Chatbot Interativo de Autoatendimento com foco em conversão para WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------
   * 1. ATUALIZAÇÃO DO ANO DE COPYRIGHT
   * ------------------------------------------------------------------------- */
  const yearSpan = document.getElementById('yearSpan');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------------
   * 2. MENU MOBILE (SIMPLES E LEVE)
   * ------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('open');
      mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Fechar ao clicar em qualquer item do menu
    const navItems = mainNav.querySelectorAll('.nav-link');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 680) {
          mainNav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
   * 3. WIDGET DE CHATBOT FLUTUANTE (VANILLA JS)
   * Autoatendimento rápido simulando digitação e direcionando para o WhatsApp
   * ------------------------------------------------------------------------- */
  const OdontoChatbot = (() => {
    // Configuração do WhatsApp padrão para direcionamento rápido
    // (O usuário pode alterar o número e a mensagem padrão aqui facilmente)
    const CONFIG = {
      whatsappUrl: 'https://api.whatsapp.com/send?phone=5511958826086&text=Ol%C3%A1!%20Estava%20no%20chat%20do%20site%20e%20gostaria%20de%20falar%20com%20um%20atendente.',
      typingDelay: 500 // 500ms para simular digitação humana fluida
    };

    // Perguntas e Respostas pré-definidas conforme os requisitos
    const FAQ_DATA = [
      {
        id: 1,
        question: 'Onde vocês atendem?',
        answer: 'Temos laboratórios em São Paulo (Lapa/Capital) e São José dos Campos. Podemos agendar uma avaliação!'
      },
      {
        id: 2,
        question: 'Vocês dão garantia?',
        answer: 'Sim! Todos os nossos consertos possuem 90 dias de garantia e emissão de Nota Fiscal.'
      },
      {
        id: 3,
        question: 'Fico sem caneta durante o conserto?',
        answer: 'Não! Nós oferecemos uma *Caneta de Empréstimo* mediante caução para você não precisar desmarcar pacientes.'
      },
      {
        id: 4,
        question: 'Falar com um atendente',
        isAction: true,
        action: () => {
          window.open(CONFIG.whatsappUrl, '_blank', 'noopener,noreferrer');
        }
      }
    ];

    // Elementos do DOM
    const toggleBtn = document.getElementById('chatbotToggleBtn');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotCloseBtn');
    const messagesContainer = document.getElementById('chatbotMessages');

    let hasStarted = false;

    // Inicialização do Chatbot
    const init = () => {
      if (!toggleBtn || !chatWindow || !messagesContainer) return;

      // Evento de abrir/fechar pelo botão flutuante
      toggleBtn.addEventListener('click', toggleChat);

      // Evento de fechar no botão "X"
      if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
      }
    };

    // Alternar abertura/fechamento do chat
    const toggleChat = () => {
      const isOpen = chatWindow.classList.contains('open');
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    };

    const openChat = () => {
      chatWindow.classList.add('open');
      chatWindow.setAttribute('aria-hidden', 'false');

      // Se for a primeira vez que abre, dispara a mensagem de boas-vindas
      if (!hasStarted) {
        startConversation();
        hasStarted = true;
      }
    };

    const closeChat = () => {
      chatWindow.classList.remove('open');
      chatWindow.setAttribute('aria-hidden', 'true');
    };

    // Inicia a conversa com a mensagem automática e os 4 botões
    const startConversation = () => {
      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();
        appendBotMessage('Olá, doutor(a)! Como posso ajudar com seus equipamentos hoje?');
        renderOptions();
      }, CONFIG.typingDelay);
    };

    // Adiciona balão de mensagem do Bot
    const appendBotMessage = (text) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg chat-msg-bot';
      // Converte formatação simples de negrito (*palavra*)
      const formattedText = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
      msgDiv.innerHTML = formattedText;
      messagesContainer.appendChild(msgDiv);
      scrollToBottom();
    };

    // Adiciona balão de mensagem do Usuário
    const appendUserMessage = (text) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg chat-msg-user';
      msgDiv.textContent = text;
      messagesContainer.appendChild(msgDiv);
      scrollToBottom();
    };

    // Exibe os 3 pontinhos simulando digitação
    const showTypingIndicator = () => {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-typing';
      typingDiv.id = 'chatTypingIndicator';
      typingDiv.innerHTML = `
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      `;
      messagesContainer.appendChild(typingDiv);
      scrollToBottom();
    };

    // Remove o indicador de digitação
    const removeTypingIndicator = () => {
      const indicator = document.getElementById('chatTypingIndicator');
      if (indicator) {
        indicator.remove();
      }
    };

    // Renderiza a lista de 4 botões de opções
    const renderOptions = () => {
      const optionsWrap = document.createElement('div');
      optionsWrap.className = 'chat-options-wrap';

      FAQ_DATA.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-option-btn';

        if (item.isAction) {
          btn.classList.add('btn-wa-action');
          btn.innerHTML = `<span>💬 ${item.question}</span> <span>➔</span>`;
        } else {
          btn.innerHTML = `<span>${item.question}</span> <span>›</span>`;
        }

        btn.addEventListener('click', () => handleOptionClick(item, optionsWrap));
        optionsWrap.appendChild(btn);
      });

      messagesContainer.appendChild(optionsWrap);
      scrollToBottom();
    };

    // Manipula o clique em uma das opções
    const handleOptionClick = (item, parentOptions) => {
      // Desabilita os botões já clicados para evitar múltiplos cliques acidentais
      const buttons = parentOptions.querySelectorAll('button');
      buttons.forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.6';
        b.style.cursor = 'default';
      });

      // 1. Exibe a pergunta selecionada como mensagem do usuário
      appendUserMessage(item.question);

      // 2. Se for ação direta para o WhatsApp, executa imediatamente
      if (item.isAction) {
        item.action();
        return;
      }

      // 3. Se for dúvida comum, simula resposta do bot com delay de 500ms
      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();
        appendBotMessage(item.answer);

        // Oferece botão para falar no WhatsApp ou ver outras dúvidas
        renderFollowUpOptions();
      }, CONFIG.typingDelay);
    };

    // Oferece opções de acompanhamento após responder uma dúvida
    const renderFollowUpOptions = () => {
      const followUpWrap = document.createElement('div');
      followUpWrap.className = 'chat-options-wrap';

      // Botão 1: Conversão direta no WhatsApp
      const waBtn = document.createElement('button');
      waBtn.type = 'button';
      waBtn.className = 'chat-option-btn btn-wa-action';
      waBtn.innerHTML = `<span>📱 Chamar Atendente no WhatsApp</span> <span>➔</span>`;
      waBtn.addEventListener('click', () => {
        window.open(CONFIG.whatsappUrl, '_blank', 'noopener,noreferrer');
      });

      // Botão 2: Ver outras perguntas
      const otherBtn = document.createElement('button');
      otherBtn.type = 'button';
      otherBtn.className = 'chat-option-btn';
      otherBtn.innerHTML = `<span>Outras dúvidas</span> <span>↺</span>`;
      otherBtn.addEventListener('click', () => {
        otherBtn.disabled = true;
        waBtn.disabled = true;
        appendUserMessage('Gostaria de ver outras dúvidas.');
        showTypingIndicator();

        setTimeout(() => {
          removeTypingIndicator();
          appendBotMessage('Claro! Escolha um dos tópicos abaixo:');
          renderOptions();
        }, CONFIG.typingDelay);
      });

      followUpWrap.appendChild(waBtn);
      followUpWrap.appendChild(otherBtn);
      messagesContainer.appendChild(followUpWrap);
      scrollToBottom();
    };

    // Rola para a mensagem mais recente
    const scrollToBottom = () => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    return {
      init
    };
  })();

  // Inicializa o Chatbot
  OdontoChatbot.init();
});
