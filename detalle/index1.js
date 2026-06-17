const detailDiv = document.getElementById('character-detail');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const brokenImages = [
    "Roos Tarpals",
    "Rugor Nass",
    "Adi Gallia",
    "Saesee Tiin",
    "Yarael Poof",
    "Ric Olié",
    "Ben Quadinaros",
    "Mace Windu",
    "Wedge Antilles",
    "Lobot",
    "Mon Mothma",
    "Shmi Skywalker",
    "Ratts Tyerell",
    "Gasgano",
    "Cordé",
    "Luminara Unduli",
    "Dormé",
    "San Hill",
    "Grievous",
    "Dexter Jettster",
    "Sly Moore",
    "Tion Medon",
    "Finn"
];

//CARACTERISTICAS
const translations = {
    "male": "Masculino",
    "female": "Femenino",
    "hermaphrodite": "Hermafrodita",
    "none": "Ninguno",

    "human": "Humano",
    "droid": "Droide",
    "wookiee": "Wookiee",
    "gungan": "Gungan",
    "ewok": "Ewok",
    "mon calamari": "Mon Calamari",
    "twi'lek": "Twi'lek",

    "black": "Negro",
    "brown": "Castaño",
    "blond": "Rubio",
    "white": "Blanco",
    "grey": "Gris",

    "blue": "Azul",
    "green": "Verde",
    "yellow": "Amarillo",
    "red": "Rojo",
    "orange": "Naranja",
    "hazel": "Avellana"
};

function translate(value) {
    if (!value) return "Desconocido";

    const lower = value.toLowerCase().trim();

    return (
        translations[lower] ||
        value.charAt(0).toUpperCase() +
        value.slice(1).toLowerCase()
    );
}

function formatHeight(height) {
    if (!height) return "Desconocido";

    const num = Number(height);

    return isNaN(num)
        ? height
        : num.toFixed(2) + " m";
}

function formatBirthYear(born) {
    if (born === undefined || born === null || born === "") {
        return "Desconocido";
    }

    const num = Number(born);

    if (isNaN(num)) return born;

    if (num < 0) {
        return `${Math.abs(num)} BBY`;
    }

    if (num > 0) {
        return `${num} ABY`;
    }

    return "Año 0";
}

async function loadDetail() {
    try {
        const response = await fetch(
            `https://akabab.github.io/starwars-api/api/id/${id}.json`
        );

        const char = await response.json();

        let imageUrl = char.image;

        if (brokenImages.includes(char.name) || !imageUrl) {
            imageUrl = "../start.png";
        }

        detailDiv.innerHTML = `
            <img
                src="${imageUrl}"
                class="w-full h-96 object-contain bg-slate-950 rounded-2xl mb-6"
                onerror="this.src='../star.png'"
            >

            <h1 class="text-4xl text-blue-700 font-bold mb-6 text-center">
                ${char.name}
            </h1>

            <div class="space-y-4 text-lg text-slate-200">

                <p>
                    <span class="text-blue-500 font-bold">
                        Altura:
                    </span>
                    ${formatHeight(char.height)}
                </p>

                <p>
                    <span class="text-blue-500 font-bold">
                        Peso:
                    </span>
                    ${char.mass ? char.mass + " kg" : "Desconocido"}
                </p>

                <p>
                    <span class="text-blue-500 font-bold">
                        Género:
                    </span>
                    ${translate(char.gender)}
                </p>

                <p>
                    <span class="text-blue-500 font-bold">
                        Especie:
                    </span>
                    ${translate(char.species)}
                </p>

                <p>
                    <span class="text-blue-500 font-bold">
                        Mundo Natal:
                    </span>
                    ${translate(char.homeworld)}
                </p>

                <p>
                    <span class="text-blue-500 font-bold">
                        Año de nacimiento:
                    </span>
                    ${formatBirthYear(char.born)}
                </p>

                <p>
                    <span class="text-blue-500 font-bold">
                        Color de ojos:
                    </span>
                    ${translate(char.eyeColor)}
                </p>

                <p>
                    <span class="text-blue-500 font-bold">
                        Color de cabello:
                    </span>
                    ${translate(char.hairColor)}
                </p>

            </div>

            <a
                href="../index.html"
                class="mt-8 block text-center bg-green-500 text-slate-900 font-bold py-3 rounded-xl hover:bg-orange-700 transition"
            >
                Volver a la Galaxia
            </a>
        `;

    } catch (error) {
        console.error(error);

        detailDiv.innerHTML = `
            <p class="text-red-500 text-center text-lg">
                Error al cargar .
            </p>
        `;
    }
}

loadDetail();