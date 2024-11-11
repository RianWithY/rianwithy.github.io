const apiKey = 'a42fa0030bd4b1e97d045e0952cfab56'; // Substitua pela sua chave de API
let correctMedia;
let options = [];
let isMovieRound = true; // Controla se a rodada será sobre filme ou série

function getRandomMedia() {
    document.getElementById('options').setAttribute('style', 'pointer-events: visible;');
    if (isMovieRound) {
        // Busca filme
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR&page=1`)
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                correctMedia = data.results[randomIndex];
                options = [correctMedia];

                // Adiciona mais 3 opções aleatórias
                while (options.length < 4) {
                    const randomOption = data.results[Math.floor(Math.random() * data.results.length)];
                    if (!options.includes(randomOption)) {
                        options.push(randomOption);
                    }
                }
                // Embaralha as opções
                options.sort(() => Math.random() - 0.5);
                displayQuestion();
            })
            .catch(error => console.error('Erro:', error));
    } else {
        // Busca série
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=pt-BR&page=1`)
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                correctMedia = data.results[randomIndex];
                options = [correctMedia];

                // Adiciona mais 3 opções aleatórias
                while (options.length < 4) {
                    const randomOption = data.results[Math.floor(Math.random() * data.results.length)];
                    if (!options.includes(randomOption)) {
                        options.push(randomOption);
                    }
                }
                // Embaralha as opções
                options.sort(() => Math.random() - 0.5);
                displayQuestion();
            })
            .catch(error => console.error('Erro:', error));
    }
    // Alterna entre filme e série para a próxima rodada
    isMovieRound = !isMovieRound;
}

function displayQuestion() {
    document.getElementById('question').innerHTML = `<p>Qual é o filme ou série?</p>`;
    document.getElementById('mediaImage').src = `https://image.tmdb.org/t/p/w500${correctMedia.poster_path}`;
    document.getElementById('mediaImage').style.height = '150px'; // Mostra a imagem cortada
    document.getElementById('mediaImage').style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    // Cria botões para as opções
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.title || option.name; // title para filmes, name para séries
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

//essa funcao bloqueia o uso das opcoes caso o usuario digite corretamente de acordo com o parametro value - se 0, eh possivel
//continuar, caso contrario, (1), o usuario nao podera clicar nas opcoes
blockOptions = (value) => {
    if(value == 1){
        document.getElementById('options').setAttribute('style', 'pointer-events: none;'); //'pointer-events: none' define os eventos como nulos, ou seja, nada acontece se clicar em algumas das opcoes de escolha filme/serie
    }else if(value == 0){
        document.getElementById('options').setAttribute('style', 'pointer-events: visible;'); //aqui, eh o contrario
    }
}

//essa funcao mostra a sinopse do filme no caso do usuario acertar o filme/serie - se o valor do parametro for 0, ele mostra, caso contrario, se (1), ele nao mostra
displaySinopse = (value) => {
    if(value == 1){
        var teste = `${correctMedia.overview}`; //essa funcao armazena o dado capturado no fetch que se refere a sinopse do fime
        if(teste.length>500){ //aqui, testo se o comprimento da string armazenada eh superior a 500caracteres (pode variar de acordo com as preferencias do desenvolvedor e de como ele posicionou os itens) - serve para evitar de ultrapassar o limite de altura da div que contem a sinopse
            teste = teste.substring(0, 500) + "{...}"; //se a condicao for atendida, a funcao substring transforma a sinopse inteira em somente a sinopse com 500 caracteres, incluindo espacos e esquece o restante
        }
        document.getElementById('sinopse').innerHTML = teste ?? "Nenhuma sinopse encontrada"; //aqui ela eh disposta na tela no caso de existir (portanto, ha consolescencia - se o primeiro valor existir e for diferente de nulo, ele será utilizado, caso contrario, testa o proximo valor)
        document.getElementById('sinopse').style.display = 'block'; //display block para exibir
    }else if(value == 0){//se o valor for zero, ele nao será mostrado na tela 
        document.getElementById('sinopse').style.display = 'none';
        // document.getElementById('sinopse').innerHTML = "abacaxi";
    }
}

let ponto = 0; //sempre que o usuario recarregar a pagina, aqui sera apontado uma pontuacao inicial de zero

//essa funcao checa as respostas a partir de um option especifico
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result'); //resultDiv recebe o elemento result
    if (selected.id === correctMedia.id) { //se o selected.id (ou option escolhido .id) for identico ao correto
        ponto += 1; //se adicionar um ponto
        resultDiv.innerHTML = '<p>Correto!</p>'; //exibe que está correto
        pontuacao(ponto); //exibe a pontuacao atualizada
        displaySinopse(1); //mostra a sinopse
        blockOptions(1); //bloqueia os options
    } else { //caso contrario, somente diz que está incorreto
        resultDiv.innerHTML = `<p>Incorreto! O filme ou série era: ${correctMedia.title || correctMedia.name}</p>`;
    }

    // Mostra a imagem completa após responder
    document.getElementById('mediaImage').style.height = 'auto';
    document.getElementById('mediaImage').style.objectPosition = 'center';

    document.getElementById('nextButton').style.display = 'block';
}

//btn de next -> ir para o proximo filme ou série
document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = ''; //ela torna a div result vazia - para sumir da tela
    document.getElementById('nextButton').style.display = 'none'; //esconde o btn de proximo
    displaySinopse(0); //esconde a sinopse
    getRandomMedia(); //aqui está a funcao responsável por gerar o conteudo aleatorio de acordo com a api
};
//essa funcao exibe a pontuacao para o usuario
function pontuacao(acerto) {
    const point = document.getElementById("pontuacao"); //a pontuacao sera a div pontuacao 
    var valor = acerto; //valor igual a acerto (nesse caso, repare que quando chamar essa funcao, sera passado o 'ponto' como parametro, que sera o acerto)
    point.innerHTML = `<h2>Pontuação: ${valor}</h2>`; //aqui se atribui a div pontuacao um h2 que exibe os valores
}

// Inicia o jogo
pontuacao(ponto);
getRandomMedia();

// document.getElementById('nextButton').onclick = () => {
//     // Limpa o resultado e esconde o botão de "Próximo"
//     document.getElementById('result').innerHTML = '';
//     document.getElementById('nextButton').style.display = 'none';
//     // Chama a função que carrega um novo filme ou série
//     getRandomMedia();
// };