let currentUser = null;
let apiKeys = {}; // Objeto para armazenar as chaves da API

// --- NOVO: Função para buscar as chaves da nossa API ---
async function fetchApiKeys() {
  try {
    const response = await fetch('/api/get-keys');
    apiKeys = await response.json();
  } catch (error) {
    console.error("Erro ao buscar as chaves da API:", error);
  }
}

// Lógica para abrir e fechar o modal de escrita de cartas
const writeModal = document.getElementById("write-modal");
const writeLetterBtn = document.getElementById("write-letter-btn");
const closeBtn = document.querySelector(".close-btn");

if (writeLetterBtn) {
    writeLetterBtn.addEventListener('click', () => {
        writeModal.style.display = "flex";
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        writeModal.style.display = "none";
    });
}

window.addEventListener('click', (event) => {
    if (event.target === writeModal) {
        writeModal.style.display = "none";
    }
});

// Lógica de envio da carta e "armazenamento" na nuvem
const letterForm = document.getElementById('letter-form');
letterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const letterBody = document.getElementById('letter-body').value;
    const submitBtn = e.submitter;

    submitBtn.disabled = true;

    if (!currentUser) {
        alert("Erro: Você não está logado.");
        submitBtn.disabled = false;
        return;
    }

    try {
        const existingLetters = await fetchLetters();

        const senderName = (currentUser === 'couve-flor') ? 'Luiza' : 'Igor';
        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear().toString().slice(-2)}`;
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const signature = `${senderName} ${formattedDate} ${formattedTime}`;

        const newLetter = {
            sender: currentUser,
            content: letterBody,
            signature: signature,
            timestamp: now.getTime()
        };
        
        existingLetters.push(newLetter);

        await saveLetters(existingLetters);

        alert('Carta enviada com sucesso!');
        letterForm.reset();
        writeModal.style.display = "none";

        displayLetters(currentUser);
    } catch (error) {
        console.error("Erro ao enviar a carta:", error);
        alert("Ocorreu um erro ao enviar a carta. Tente novamente.");
    } finally {
        submitBtn.disabled = false;
    }
});

// Função para buscar as cartas do JSON Bin
async function fetchLetters() {
    try {
        const response = await fetch(apiKeys.binUrl, {
            headers: {
                'X-Master-Key': apiKeys.apiKey
            }
        });
        const data = await response.json();
        return data.record.letters || [];
    } catch (error) {
        console.error("Erro ao buscar as cartas:", error);
        return [];
    }
}

// Função para salvar as cartas no JSON Bin
async function saveLetters(lettersArray) {
    const dataToSave = {
        "letters": lettersArray
    };
    try {
        const response = await fetch(apiKeys.binUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKeys.apiKey
            },
            body: JSON.stringify(dataToSave)
        });
        await response.json();
    } catch (error) {
        console.error("Erro ao salvar a carta:", error);
    }
}

// Lógica para exibir as cartas
function displayLetters(loggedInUser) {
    const lettersContainer = document.getElementById('letters-container');
    lettersContainer.innerHTML = '<p>Carregando cartas...</p>';

    fetchLetters().then(storedLetters => {
        lettersContainer.innerHTML = '';
        const sender = (loggedInUser === 'couve-flor') ? 'brocolis' : 'couve-flor';
        
        const receivedLetters = storedLetters.filter(letter => letter.sender === sender);
        
        receivedLetters.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        if (receivedLetters.length === 0) {
            lettersContainer.innerHTML = '<p>Nenhuma carta encontrada.</p>';
        } else {
            receivedLetters.forEach(letter => {
                const letterDiv = document.createElement('div');
                letterDiv.className = 'letter';
                letterDiv.innerHTML = `
                    <p style="white-space: pre-wrap;">${letter.content}</p>
                    <p class="letter-footer">${letter.signature}</p>
                `;
                lettersContainer.appendChild(letterDiv);
            });
        }
    });
}

// Lógica de login
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password-input');
const errorMessage = document.getElementById('error-message');
const loginPanel = document.getElementById('login-panel');
const lettersPanel = document.getElementById('letters-panel');

// --- NOVO: Lógica de login com a API ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    
    // Envia a senha para a nossa API
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });
    
    const result = await response.json();

    if (result.isValid) {
        currentUser = result.user; // Define o usuário com o retorno da API
        
        if (currentUser === 'couve-flor') {
            document.getElementById('panel-title').textContent = 'Cartas de Igor';
        } else {
            document.getElementById('panel-title').textContent = 'Cartas de Luiza';
        }

        loginPanel.style.display = 'none';
        lettersPanel.style.display = 'flex';
        displayLetters(currentUser);
    } else {
        errorMessage.textContent = 'Palavra-chave incorreta.';
        return;
    }
});

// Inicia o processo de busca das chaves da API
fetchApiKeys();