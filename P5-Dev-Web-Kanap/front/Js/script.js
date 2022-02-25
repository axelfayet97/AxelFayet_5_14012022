// Création d'une requête pour demander à l'API l'ensemble des produits du catalogue
fetch("http://localhost:3000/api/products/")
    .then(res => {
        // Récupération d'une promesse et conversion en objet json
        return res.json();
    })
    .then(product => {
        //Promesse acceptée, récupération des produits
        for (var kanap of product) {
            displayProducts(kanap);
        };
    })
    .catch(err => {
        // Si une erreur survient
        console.log("Une erreur est survenue. " + err);
    });

// Fonction générant les produits trouvés dans l'API
function displayProducts(product) {
    // Création du lien dynamique 
    const createLink = document.createElement("a");
    createLink.setAttribute("href", `./product.html?id=${product._id}`);

    // Création de la balise article
    const createArticle = document.createElement("article");

    // Création de la balise image
    const createImgTag = document.createElement("img");
    createImgTag.setAttribute("src", product.imageUrl);
    createImgTag.setAttribute("alt", product.altTxt);

    // Création de la balise titre
    const createh3Title = document.createElement("h3");
    createh3Title.classList.add("productName");
    createh3Title.textContent = product.name;

    // Création de la balise texte
    const createPTag = document.createElement("p");
    createPTag.classList.add("productDescription");
    createPTag.textContent = product.description;

    // Récupération du conteneur
    const itemContainer = document.getElementById("items");

    // Attribution du contenu à la balise article
    createArticle.appendChild(createImgTag);
    createArticle.appendChild(createh3Title);
    createArticle.appendChild(createPTag);

    // Assigner un lien à la balise article
    createLink.appendChild(createArticle);

    // Assigner la balise <a> au conteneur
    itemContainer.appendChild(createLink);
};