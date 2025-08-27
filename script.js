// Data do casamento: 22 de maio de 2027, às 15:00
const weddingDate = new Date("May 22, 2027 15:00:00").getTime();

// Lógica do contador regressivo
const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").textContent = "Chegou o Grande Dia!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").textContent = `${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;

}, 1000);