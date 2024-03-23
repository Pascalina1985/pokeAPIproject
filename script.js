let currentPokemon;
let startPokemon = 0;
let pokemonList = [];

async function loadPokemon() {
    document.getElementById('pokemonOverview').innerHTML = '';
    for (let i = startPokemon + 1; i <= startPokemon + 30; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let currentPokemon = await response.json();
        console.log(currentPokemon);
        pokemonList.push(currentPokemon);
        renderMainPokemon(currentPokemon, i);
    }
}

function renderMainPokemon(currentPokemon, i) {
    document.getElementById('inputContainer').style.display = 'flex';
    document.getElementById('pokemonOverview').innerHTML += `
        <div onclick="openPokemon(${i})" class="pokemon-container">
            <div><b>${firstLetter(currentPokemon.name)}</b></div>
            <div class="pokemon-info-container">
                <button class="pokemon-button">${currentPokemon.types[0].type.name}</button>
            </div>
            <img class="pokemonPicture" id="addPicture${i}" alt="${firstLetter(currentPokemon.name)}">
        </div>`;
    document.getElementById(`addPicture${i}`).src = currentPokemon.sprites.other['official-artwork'].front_shiny;
}

function openPokemon(index) {
    document.getElementById('main-container').style.display = 'none';
    cImage = index;
    renderSinglePokemon(cImage);
}

function renderSinglePokemon(index) {
    const selectedPokemon = pokemonList[index - 1];
    const name = selectedPokemon.name;
    const type = selectedPokemon.types[0].type.name;
    const weight = selectedPokemon.weight;
    const attack = selectedPokemon.stats[0].base_stat;
    const imageUrl = selectedPokemon.sprites.other['official-artwork'].front_shiny;
    const firstAbility = selectedPokemon.abilities[0].ability.name;
    const secondAbility = selectedPokemon.abilities[1].ability.name;
    const height = selectedPokemon.height;

    document.getElementById('showPokemon').style.display = 'flex';
    document.getElementById('inputContainer').style.display = 'none';
    document.getElementById('showPokemon').innerHTML = generateSinglePokemonHTML(name, type, weight, attack, imageUrl, firstAbility, secondAbility, height);
}

function generateSinglePokemonHTML(name, type, weight, attack, imageUrl, firstAbility, secondAbility, height) {
    return `
        <img onclick="changeImage('previous')" class="arrow" src="./img/links.png">
        <div class="singlePokemonContainer">
        <img onclick="closeSingleMode()" class="arrow close" src="./img/close.png">
        <div><b>${firstLetter(name)}</b></div>
        <button class="pokemon-button">${type}</button>
        <img class="singlePicture" src="${imageUrl}" id="addSinglePicture" alt="${name}">
        <div class="pokemon-data-container">
        <div>Height: ${height} cm</div>
        <div>Weight: ${weight} g</div>
        <div class="attack-container">Attack: ${attack} ${generateProgressBar(attack)}</div>
        <div class="ability-Container">
        <div>Abilities: ${firstAbility}, ${secondAbility}</div>
        </div>
        </div>
        </div>
        <img onclick="changeImage('next')" class ="arrow" src="./img/rechts.png">
    `;
}

function generateProgressBar(attack) {
    return `
    <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="${attack}" aria-valuemin="0" aria-valuemax="100" style="position: relative;">
    <div class="progress-bar" style="width: ${attack}%; position: absolute;">
        ${attack} %
    </div>
    </div>
    `;
}

function closeSingleMode() {
    document.getElementById('showPokemon').style.display = 'none';
    document.getElementById('main-container').style.display = 'flex';
    // Leere die bestehende pokemonList, bevor du neue Pokémon lädst
    pokemonList = [];

    loadPokemon();
}


function changeImage(direction) {
    if (direction === 'previous') {
        cImage = (cImage - 1 + pokemonList.length) % pokemonList.length;
    } else if (direction === 'next') {
        cImage = (cImage + 1) % pokemonList.length;
    }

    renderSinglePokemon(cImage);
}


function firstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function search() {
    let inputValue = document.getElementById('inputField').value.toLowerCase();
    let found = false;
    for (let i = 0; i < pokemonList.length; i++) {
        if (pokemonList[i].name.toLowerCase().startsWith(inputValue)) {
            openPokemon(i + 1); // +1, da API nicht ab 0 beginnt
            found = true;
        }
    }
    if (!found) {
        alert('Bitte korrekten Namen eingeben');
    }
    document.getElementById('inputField').value = '';
}