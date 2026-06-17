/*CONST PALABRA RESERVADA VARIABLES NO PUEDE SER REASIGNADO*/

const characterListDiv = document.getElementById('character-list');
const comparisonSection = document.getElementById('comparison-section');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageIndicator = document.getElementById('page-indicator');
const searchInput = document.getElementById('search-input');
const audioFondo = document.getElementById('musicaFondo');

/*LET PALABRA RESERVADA PARA VARIABLES CUYO VALOR SE PUEDE MODIFICAR Y REASIGNAR*/
let allCharacters = [];
let selectedCharacters = [];
let currentPage = 1;
const itemsPerPage = 5;

const defaultSpaceImage = "./chuba.png";

const brokenImages = [
    "Roos Tarpals", "Rugor Nass", "Adi Gallia", "Saesee Tiin", "Yarael Poof",
    "Ric Olié", "Ben Quadinaros", "Mace Windu", "Wedge Antilles", "Lobot",
    "Mon Mothma", "Shmi Skywalker", "Ratts Tyerell", "Gasgano", "Cordé",
    "Luminara Unduli", "Dormé", "San Hill", "Grievous", "Dexter Jettster",
    "Sly Moore", "Tion Medon", "Finn"
];

/*DESCRIPCION*/
const translations = {
    "male": "Masculino",
    "female": "Femenino",
    "hermaphrodite": "Hermafrodita",
    "none": "Ninguno",
    "blond": "Rubio",
    "brown": "Castaño",
    "black": "Negro",
    "auburn": "Pelirrojo",
    "grey": "Gris",
    "white": "Blanco",
    "brown, later graying": "Castaño, luego grisáceo",
    "blond, later grey": "Rubio, luego gris",
    "human": "Humano",
    "droid": "Droide",
    "wookiee": "Wookiee",
    "gungan": "Gungan",
    "ewok": "Ewok",
    "mon calamari": "Mon Calamari",
    "yoda's species": "Especie de Yoda",
    "twi'lek": "Twi'lek"
};
//
const translate = (value) => {
    if (!value) return 'Desconocido';
    const lowerValue = value.toLowerCase().trim();
    return translations[lowerValue] || value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const capitalize = (text) => {
    if (!text || typeof text !== 'string') {
        return 'Desconocido';
    }

    return text.charAt(0).toUpperCase() +
        text.slice(1).toLowerCase();
};


const formatHeight = (height) => {
    if (!height) return 'Desconocido';
    const num = parseFloat(height);
    return isNaN(num) ? height : num.toFixed(2) + ' m';
};


const formatBirthYear = (born) => {
    if (born === undefined || born === null || born === '') return 'Desconocido';
    if (typeof born === 'string' && born.toUpperCase().includes('BBY')) return born.toUpperCase();
    const num = parseFloat(born);
    if (isNaN(num)) return translate(born);
    return num < 0 ? Math.abs(num) + ' BBY' : num > 0 ? num + ' ABY' : 'Año 0';
};

function reproducirAudio() {
    audioFondo.play().catch(error => {
        console.log("El navegador requiere interacción del usuario antes de reproducir audio.");
    });
}

function pausarAudio() {
    audioFondo.pause();
}

async function loadCharacters() {
    try {
        const response = await fetch('https://akabab.github.io/starwars-api/api/all.json');
        allCharacters = await response.json();
        renderPage();
    } catch (error) {
        console.error("Error al cargar la API:", error);
    }
}

function renderPage() {
    characterListDiv.innerHTML = '';
    const searchTerm = searchInput?.value.toLowerCase() || '';

    const filteredCharacters = allCharacters.filter(character =>
        character.name.toLowerCase().includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage) || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const characters = filteredCharacters.slice(startIndex, endIndex);


    characters.forEach(character => {
        console.log(character.name, character.homeworld);
        let imageUrl = character.image;
        if (brokenImages.includes(character.name) || !imageUrl) imageUrl = defaultSpaceImage;

        const isSelected = selectedCharacters.some(c => c.id === character.id);
        const btnClass = isSelected
            ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            : "bg-sky-100 hover:bg-orange-400 text-slate-950 font-bold";
        const btnText = isSelected ? "Quitar" : "Seleccionar para comparar";

        characterListDiv.innerHTML += `
            <div class="bg-slate-900/80 backdrop-blur-sm border ${isSelected ? 'border-red-700 scale-[1.02]' : 'border-slate-700'} rounded-2xl p-4 hover:scale-105 hover:border-yellow-400 transition duration-300 flex flex-col justify-between shadow-md">
                <div>
                    <div class="w-full h-72 flex items-center justify-center bg-slate-950/40 rounded-xl mb-4 overflow-hidden">
                        <img class="max-w-full max-h-full object-contain" src="${imageUrl}" alt="${character.name}" onerror="this.src='./start.png';">
                    </div>
                    <h2 class="text-base font-bold text-center text-green-400 capitalize mb-3">${character.name}</h2>
                </div>
                    <div class="flex flex-col gap-3">

                     <button onclick="toggleSelectCharacter(${character.id})"
                      class="w-full py-2 rounded-xl font-bold text-xs transition duration-300 cursor-pointer ${btnClass}">
                        ${btnText}
                     </button>

                      <a href="./detalle/index1.html?id=${character.id}"
                     class="w-full text-center py-2 rounded-xl bg-slate-500 hover:bg-slate-900 text-white font-bold text-xs block transition">
                       Ver Detalle
    </a>
            
        <div class="text-slate-400 text-[11px] text-center border-t border-slate-700 pt-2">
        <p><span class="text-orange-500">Especie:</span> <span>${translate(character.species)}</span></p>
        <p><span class="text-orange-500">Origen:</span> <span>${capitalize(character.homeworld)}</span></p>
        </div>

        </div>


        </div>
        `;
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = endIndex >= filteredCharacters.length;
    prevBtn.style.opacity = prevBtn.disabled ? "0.4" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.4" : "1";
    pageIndicator.textContent = `${currentPage} de ${totalPages}`;
}

/*Seleccion de Comparacion de personajes*/
window.toggleSelectCharacter = function (id) {
    const character = allCharacters.find(c => c.id === id);
    const index = selectedCharacters.findIndex(c => c.id === id);
    if (index !== -1) {
        selectedCharacters.splice(index, 1);
    } else {
        if (selectedCharacters.length >= 2) {
            alert("¡Solo puedes seleccionar un máximo de 2 personajes!");
            return;
        }
        selectedCharacters.push(character);
    }
    renderPage();
    renderComparison();
};

function renderComparison() {
    if (selectedCharacters.length === 2) {
        const char1 = selectedCharacters[0];
        const char2 = selectedCharacters[1];
        const img1 = brokenImages.includes(char1.name) ? defaultSpaceImage : char1.image;
        const img2 = brokenImages.includes(char2.name) ? defaultSpaceImage : char2.image;

        //COMPARASIONES
        comparisonSection.innerHTML = `
            <div class="w-[98%] md:w-[1300px] max-w-7xl bg-slate-950 rounded-2xl p-8 border-2 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.2)] relative max-h-[95vh] overflow-y-auto animate-modal">
                <button onclick="clearComparison()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl cursor-pointer transition">✕</button>
                <h2 class="text-2xl md:text-3xl font-bold text-center text-yellow-400 mb-8">📊 Comparación de Personajes</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse table-fixed text-base">
                        <thead>
                            <tr class="border-b border-slate-800">
                                <th class="py-4 px-6 text-slate-400 font-medium uppercase tracking-wider text-xs w-1/3">Personaje</th>
                                <th class="py-4 px-6 text-yellow-400 font-bold text-center text-lg w-1/3">${char1.name}</th>
                                <th class="py-4 px-6 text-yellow-400 font-bold text-center text-lg w-1/3">${char2.name}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/50">
                            <tr><td class="py-6 px-6 text-slate-400 font-medium">Avatar</td><td><img class="w-36 h-36 mx-auto object-contain" src="${img1}" onerror="this.src='./default.png';"></td><td><img class="w-36 h-36 mx-auto object-contain" src="${img2}" onerror="this.src='./default.png';"></td></tr>
                            <tr><td class="py-4 px-6 text-slate-400 font-medium">Altura</td><td class="py-4 px-6 text-center">${formatHeight(char1.height)}</td><td class="py-4 px-6 text-center">${formatHeight(char2.height)}</td></tr>
                            <tr><td class="py-4 px-6 text-slate-400 font-medium">Peso</td><td class="py-4 px-6 text-center">${char1.mass ? char1.mass + ' kg' : 'Desconocido'}</td><td class="py-4 px-6 text-center">${char2.mass ? char2.mass + ' kg' : 'Desconocido'}</td></tr>
                            <tr><td class="py-4 px-6 text-slate-400 font-medium">Género</td><td class="py-4 px-6 text-center">${translate(char1.gender)}</td><td class="py-4 px-6 text-center">${translate(char2.gender)}</td></tr>
                            <tr><td class="py-4 px-6 text-slate-400 font-medium">Color de Cabello</td><td class="py-4 px-6 text-center">${translate(char1.hairColor)}</td><td class="py-4 px-6 text-center">${translate(char2.hairColor)}</td></tr>
                            <tr><td class="py-4 px-6 text-slate-400 font-medium">Año de Nacimiento</td><td class="py-4 px-6 text-center">${formatBirthYear(char1.born)}</td><td class="py-4 px-6 text-center">${formatBirthYear(char2.born)}</td></tr>
                            <tr><td class="py-4 px-6 text-slate-400 font-medium">Especie</td><td class="py-4 px-6 text-center">${translate(char1.species)}</td><td class="py-4 px-6 text-center">${translate(char2.species)}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-8 flex justify-end">
                    <button onclick="clearComparison()" class="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-6 py-3 rounded-xl font-bold border border-slate-800/80 cursor-pointer transition">Cerrar y Limpiar</button>
                </div>
            </div>
        `;
        comparisonSection.classList.replace('hidden', 'flex');
    } else {
        comparisonSection.classList.replace('flex', 'hidden');
    }
}

window.clearComparison = function () {
    selectedCharacters = [];
    renderPage();
    renderComparison();
};

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextBtn.addEventListener('click', () => {

    console.log("ANTES:", currentPage);

    const searchTerm = searchInput?.value.toLowerCase() || '';

    const filteredCharacters = allCharacters.filter(character =>
        character.name.toLowerCase().includes(searchTerm)
    );

    const maxPages = Math.ceil(filteredCharacters.length / itemsPerPage);

    if (currentPage < maxPages) {
        currentPage++;
        console.log("DESPUÉS:", currentPage);
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderPage();
});

loadCharacters();
