document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const phrases = [
        "Tanyakan apa saja...",
        "Buat sebuah cerita",
        "Bagaimana cara kerja AI?",
        "Cari ide resep masakan"
    ];

    let currentIndex = 0;
    let currentPhrase = [];
    let isDeleting = false;
    let typingSpeed = 150;

    function type() {
        const fullPhrase = phrases[currentIndex];
        
        if (isDeleting) {
            // Proses menghapus
            currentPhrase.pop();
        } else {
            // Proses mengetik
            currentPhrase.push(fullPhrase[currentPhrase.length]);
        }

        chatInput.placeholder = currentPhrase.join('');

        // Logika untuk beralih antara mengetik dan menghapus
        if (!isDeleting && currentPhrase.join('') === fullPhrase) {
            // Jeda sejenak setelah selesai mengetik
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && currentPhrase.length === 0) {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % phrases.length;
        }

        setTimeout(type, isDeleting ? 75 : typingSpeed);
    }

    // Mulai animasi
    type();
});