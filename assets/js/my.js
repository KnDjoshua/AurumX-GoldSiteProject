

    document.addEventListener('DOMContentLoaded', () => {
      const widget = document.getElementById('gold-widget');
      const toggleBtn = document.getElementById('widget-toggle');
      const closeBtn = document.getElementById('close-btn');
      const widgetHeader = document.getElementById('widget-header');
      const widgetBody = document.getElementById('widget-body');
      const chatContainer = document.getElementById('chat-container');
      const inputArea = document.getElementById('input-area');
      const userInput = document.getElementById('user-input');
      const sendBtn = document.getElementById('send-btn');
      const priceDisplay = document.getElementById('price-display');
      const currentPriceElement = document.getElementById('current-price');

      // Initialize Chart.js mini chart
      const ctx = document.getElementById('mini-chart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array(20).fill(''),
          datasets: [{
            data: Array.from({ length: 20 }, () => 1900 + Math.random() * 50),
            borderColor: '#FFD700',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          },
          scales: {
            y: { display: false, beginAtZero: false },
            x: { display: false }
          }
        }
      });

      // Simulated live price
      let currentPrice = 1950.25;

      function updatePrice() {
        const change = (Math.random() - 0.5) * 10;
        currentPrice = Math.max(1900, currentPrice + change);

        // Update price display
        currentPriceElement.textContent = `$${currentPrice.toFixed(2)}`;
        priceDisplay.textContent = `$${currentPrice.toFixed(2)}/oz`;

        // Update chart data
        chart.data.datasets[0].data.shift();
        chart.data.datasets[0].data.push(currentPrice);
        chart.update();

        // Show notification for big change
        if (Math.abs(change) > 5) {
          showNotification(`<strong>Price Movement:</strong> Gold price ${change > 0 ? 'increased' : 'decreased'} by $${Math.abs(change).toFixed(2)}`);
        }

        setTimeout(updatePrice, 5000 + Math.random() * 10000);
      }

      function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = message;
        widgetBody.insertBefore(notification, widgetBody.children[1]); // below chart

        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
          }, 300);
        }, 10000);
      }

      // Widget toggle handlers
      toggleBtn.addEventListener('click', () => {
        widget.classList.toggle('active');
      });

      closeBtn.addEventListener('click', () => {
        widget.classList.remove('active');
      });

      // Chat functionality
      widgetHeader.addEventListener('click', () => {
        if (chatContainer.style.display === 'flex') return;
        chatContainer.style.display = 'flex';
        inputArea.style.display = 'flex';
        if (!chatContainer.hasChildNodes()) {
          addBotMessage("Hello! I'm your gold trading assistant. How can I help you today?");
        }
        userInput.focus();
      });

      function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.textContent = text;
        chatContainer.appendChild(div);
        scrollChat();
      }

      function addBotMessage(text) {
        const typing = document.createElement('div');
        typing.className = 'message bot-message typing-indicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatContainer.appendChild(typing);
        scrollChat();

        setTimeout(() => {
          typing.remove();
          const div = document.createElement('div');
          div.className = 'message bot-message';
          div.textContent = text;
          chatContainer.appendChild(div);
          scrollChat();
        }, 1200 + Math.random() * 800);
      }

      function scrollChat() {
        widgetBody.scrollTop = widgetBody.scrollHeight;
      }

      function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        addUserMessage(text);
        userInput.value = '';

        setTimeout(() => {
          const replies = [
            "I can help you with current gold prices, market trends, and trading advice.",
            "Would you like me to connect you with a gold trading specialist?",
            "Current gold prices are volatile due to market conditions.",
            "For personalized assistance, please visit our website or contact our trading desk."
          ];
          addBotMessage(replies[Math.floor(Math.random() * replies.length)]);
        }, 600);
      }

      sendBtn.addEventListener('click', sendMessage);
      userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
      });

      // Auto open widget and start updates
      setTimeout(() => {
        widget.classList.add('active');
        updatePrice();
      }, 2000);
    });
