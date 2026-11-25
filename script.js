// ==========================================
// 1. ELEMENTOS DO HTML
// ==========================================

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Botões de controle da câmera
const iniciar = document.getElementById("iniciar");
const alternar = document.getElementById("alternar");
const desligar = document.getElementById("desligar");

// Botões de filtros
const normal = document.getElementById("normal");
const grayscale = document.getElementById("grayscale");
const sepia = document.getElementById("sepia");

// Botões de captura e download
const capturar = document.getElementById("capturar");
const baixar = document.getElementById("baixar");

// ==========================================
// 2. VARIÁVEIS DE CONTROLE
// ==========================================

let stream = null;
let cameraAtual = "environment";
let filtroAtual = "normal";

// ==========================================
// 3. INICIAR CÂMERA
// ==========================================

async function iniciarCamera() {

    desligarCamera();

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: cameraAtual
            },
            audio: false
        });

        video.srcObject = stream;

    } catch (erro) {

        console.error(erro);

        if (erro.name === "NotFoundError") {
            alert("Nenhuma câmera foi encontrada no dispositivo.");
        } else if (erro.name === "NotAllowedError") {
            alert("Permita o acesso à câmera no navegador.");
        } else {
            alert("Não foi possível acessar a câmera: " + erro.message);
        }
    }
}

// ==========================================
// 4. DESLIGAR CÂMERA
// ==========================================

function desligarCamera() {

    if (stream) {

        stream.getTracks().forEach(track => track.stop());

        stream = null;

        video.srcObject = null;
    }
}

// ==========================================
// 5. ALTERNAR CÂMERA
// ==========================================

function alternarCamera() {

    cameraAtual = cameraAtual === "environment"
        ? "user"
        : "environment";

    iniciarCamera();
}

// ==========================================
// 6. APLICAR FILTROS
// ==========================================

function aplicarFiltro(filtro) {

    filtroAtual = filtro;

    video.className = filtro;

    // Remove o destaque dos botões
    normal.classList.remove("ativo");
    grayscale.classList.remove("ativo");
    sepia.classList.remove("ativo");

    // Destaca o filtro selecionado
    document.getElementById(filtro).classList.add("ativo");
}

// ==========================================
// 7. CAPTURAR FOTOGRAFIA
// ==========================================

function capturarFoto() {

    // Verifica se a câmera está funcionando
    if (!stream || video.readyState < 2) {

        alert("Inicie a câmera antes de capturar uma foto.");

        return;
    }

    // Define as dimensões da fotografia
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Captura um quadro do vídeo
    context.drawImage(video, 0, 0);

    // Aplica o filtro à fotografia
    if (filtroAtual !== "normal") {

        const imagem = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const pixels = imagem.data;

        for (let i = 0; i < pixels.length; i += 4) {

            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Filtro Grayscale
            if (filtroAtual === "grayscale") {

                const cinza =
                    0.2126 * r +
                    0.7152 * g +
                    0.0722 * b;

                pixels[i] = cinza;
                pixels[i + 1] = cinza;
                pixels[i + 2] = cinza;
            }

            // Filtro Sepia
            else if (filtroAtual === "sepia") {

                pixels[i] =
                    0.393 * r +
                    0.769 * g +
                    0.189 * b;

                pixels[i + 1] =
                    0.349 * r +
                    0.686 * g +
                    0.168 * b;

                pixels[i + 2] =
                    0.272 * r +
                    0.534 * g +
                    0.131 * b;
            }
        }

        context.putImageData(imagem, 0, 0);
    }

    // Exibe a fotografia capturada
    canvas.hidden = false;

    // Habilita o botão de download
    baixar.disabled = false;
}

// ==========================================
// 8. BAIXAR FOTOGRAFIA
// ==========================================

function baixarFoto() {

    const link = document.createElement("a");

    link.download = "lente-inteligente-" + Date.now() + ".png";

    link.href = canvas.toDataURL("image/png");

    link.click();
}

// ==========================================
// 9. EVENTOS DOS BOTÕES
// ==========================================

// Controle da câmera
iniciar.addEventListener("click", iniciarCamera);
alternar.addEventListener("click", alternarCamera);
desligar.addEventListener("click", desligarCamera);

// Controle dos filtros
normal.addEventListener("click", () => {
    aplicarFiltro("normal");
});

grayscale.addEventListener("click", () => {
    aplicarFiltro("grayscale");
});

sepia.addEventListener("click", () => {
    aplicarFiltro("sepia");
});

// Captura e download
capturar.addEventListener("click", capturarFoto);
baixar.addEventListener("click", baixarFoto);

// ==========================================
// 10. CONFIGURAÇÃO INICIAL
// ==========================================

aplicarFiltro("normal");