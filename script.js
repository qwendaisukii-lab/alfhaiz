document.addEventListener('DOMContentLoaded', () => {
    // 1. AMBIL ELEMEN DARI HTML
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.querySelector('.send-icon');
    const centerLogo = document.querySelector('.center-logo');

    // 2. FUNGSI UNTUK MENAMBAHKAN PESAN KE LAYAR
    const addMessage = (content, sender) => {
        // Hilangkan logo di tengah jika ini adalah pesan pertama
        if (centerLogo && centerLogo.style.display !== 'none') {
            centerLogo.style.display = 'none';
        }

        const messageWrapper = document.createElement('div');
        // Tambahkan class umum 'message' dan class spesifik 'user-message' atau 'ai-message'
        messageWrapper.classList.add('message', `${sender}-message`);
        messageWrapper.innerHTML = content; // Menggunakan innerHTML agar bisa render HTML (untuk spinner)
        
        chatContainer.appendChild(messageWrapper);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll ke bawah
    };

    // 3. FUNGSI UTAMA KETIKA TOMBOL KIRIM DITEKAN
    const handleSendMessage = async () => {
        const userPrompt = chatInput.value.trim();
        if (userPrompt === '') return; // Jangan kirim jika input kosong

        // Tampilkan pesan pengguna di layar
        addMessage(userPrompt, 'user');
        chatInput.value = ''; // Kosongkan input

        // Tampilkan animasi loading
        const loadingSpinnerHtml = '<div class="spinner-container"><div class="spinner"></div></div>';
        addMessage(loadingSpinnerHtml, 'ai');

        // 4. MENGIRIM PERMINTAAN KE BACKEND (API VERCEL)
        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userPrompt }), // Kirim prompt pengguna
            });
            
            // Hapus animasi loading dari layar
            const spinnerElement = document.querySelector('.spinner-container');
            if (spinnerElement) {
                spinnerElement.parentNode.remove();
            }

            if (!response.ok) {
                // Jika server merespons dengan error (misal: API key salah)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // 5. TAMPILKAN RESPONS DARI AI
            addMessage(data.text, 'ai');

        } catch (error) {
            console.error("Fetch Error:", error);
            // Hapus juga loading jika terjadi error saat fetch
            const spinnerElement = document.querySelector('.spinner-container');
            if (spinnerElement) {
                spinnerElement.parentNode.remove();
            }
            addMessage("Maaf, sepertinya ada masalah koneksi. Coba lagi nanti.", 'ai');
        }
    };

    // 6. EVENT LISTENER UNTUK TOMBOL & ENTER
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
});