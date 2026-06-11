const templateGrid = document.getElementById("templates");
const searchInput = document.getElementById("searchInput");
const uploadBtn = document.getElementById("uploadBtn");
const imageUpload = document.getElementById("imageUpload");

let allMemes = [];

async function displayMemes(memesToShow = null) {

    const memes = memesToShow || allMemes;

    templateGrid.innerHTML = "";

    memes.forEach(meme => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <img src="${meme.url}" alt="${meme.name}">
            <p>${meme.name}</p>
        `;

        card.addEventListener("click", () => {

            localStorage.setItem(
                "selectedMeme",
                JSON.stringify(meme)
            );

            localStorage.removeItem(
                "uploadedImage"
            );

            window.location.href =
                "editor.html";
        });

        templateGrid.appendChild(card);
    });
}

async function initializeApp() {

    allMemes = await fetchMemes();

    displayMemes(allMemes.slice(0, 20));

    searchInput.addEventListener("input", () => {

        const searchTerm =
            searchInput.value.toLowerCase();

        const filteredMemes =
            allMemes.filter(meme =>
                meme.name
                    .toLowerCase()
                    .includes(searchTerm)
            );

        displayMemes(filteredMemes);
    });
}

uploadBtn.addEventListener("click", () => {

    imageUpload.click();

});

imageUpload.addEventListener("change", event => {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload = function(e) {

        localStorage.setItem(
            "uploadedImage",
            e.target.result
        );

        localStorage.removeItem(
            "selectedMeme"
        );

        window.location.href =
            "editor.html";
    };

    reader.readAsDataURL(file);

});

initializeApp();