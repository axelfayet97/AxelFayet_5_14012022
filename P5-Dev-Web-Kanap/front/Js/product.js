// Récupération de l'url
function getId() {
    var url = window.location.href;
    var productsId = new URL(url).searchParams.get("id");
    return productsId
}

// Création du lien fetch de la page produit
fetch(`http://localhost:3000/api/products/${getId()}`)
    .then(res => {
        // Récupération de la promesse et conversion en objet json
        return res.json();
    })
    .then(product => {
        //Promesse acceptée, récupération du produit et appel de la fonction l'affichant
        displayProducts(product);
    })
    .catch(err => {
        // Si une erreur survient
        const mainContent = document.querySelector("section article");
        mainContent.innerHTML = "";
        mainContent.classList.add('item__content__addButton');

        // Texte erreur
        const createH1 = document.createElement("h1");
        createH1.innerHTML = "Désolé ! <br /> Le produit que vous recherchez n'existe pas !";

        // CTA Retour à l'accueil
        const createCTA = document.createElement("button");
        createCTA.textContent = "Retour à l'accueil";
        createCTA.addEventListener("click", () => {
            window.location.href = "/P5-Dev-Web-Kanap/front/html/index.html";
        });

        mainContent.appendChild(createH1);
        mainContent.appendChild(createCTA);

        console.log("Une erreur est survenue." + err);
    });

// Fonction affichant les données du produit trouvé
function displayProducts(product) {
    // Création et ajout de l'image du produit
    const targetImg = document.querySelector(".item__img");
    const createImgTag = document.createElement("img");
    createImgTag.setAttribute("src", product.imageUrl);
    createImgTag.setAttribute("alt", product.altTxt);
    targetImg.appendChild(createImgTag);

    // Ajout du titre de l'article
    const assignTitle = document.getElementById("title");
    assignTitle.textContent = product.name;

    // Ajout du prix dans la balise span
    const setPrice = document.getElementById("price");
    setPrice.textContent = product.price;

    // Ajout de la description dans la balise p
    const assignDescription = document.getElementById("description");
    assignDescription.textContent = product.description;

    // Ajout des options dans la balise select
    const targetSelect = document.getElementById("colors");
    const colorsArray = product.colors;
    for (let color of colorsArray) {
        const createOption = document.createElement("option");
        createOption.value = color;
        createOption.textContent = color;
        targetSelect.appendChild(createOption)
    };

    // OPTIONNEL - Reparamétrage de la valeur du champs input
    document.getElementById("quantity").setAttribute("value", "1");

    // OPTIONNEL - Changement nom titre de la page
    document.title = product.name;
};

// Ajout d'un article au localstorage au clic sur le bouton "Ajouter au panier"
const buttonAdd = document.getElementById("addToCart");
buttonAdd.addEventListener("click", () => {
    // On récupère les données dont on a besoin : prix, couleur & nombre d'article(s)
    const color = document.getElementById("colors").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const id = getId();
    const getLocalstorage = localStorage.getItem("products");
    let cart = [];

    // Vérification des champs renseignés : si vide alors on affiche un message d'erreur
    if (quantity == 0) {
        alert("Veuillez sélectionner une quantité supérieure à 1");
        return
    }
    if (color == "") {
        alert("Veuillez sélectionner une couleur.");
        return
    }

    // Ajout des données au localstorage
    if (getLocalstorage) {
        // On récupère le contenu du localstorage
        cart = JSON.parse(getLocalstorage);
        // On assigne une variable vérifiant qu'un produit est présent dans le localstorage par défaut sur false
        let productExists = false;
        // Si un produit est déjà dans le locastorage
        for (const product of cart) {
            if (product.id == id && product.color == color) {
                // Alors on ajoute la quantité sélectionnée
                product.quantity += quantity;
                // Et on assigne la variable de produit existant sur true
                productExists = true;
            };
        };
        // Si le produit est déjà présent
        if (!productExists) {
            // Alors on l'ajoute au tableau
            cart.push({
                id: id,
                color: color,
                quantity: quantity
            });
        };
    } else {
        //Si aucun produit n'est présent, alors on crée un objet dans l'array cart
        cart = [{
            id: id,
            color: color,
            quantity: quantity
        }];
    };

    // Enfin on actualise le localstorage contenant les nouvelles caractéristiques du produit et on informe l'utilisateur du succès de l'ajout du produit au panier
    localStorage.setItem("products", JSON.stringify(cart));
    alert("Votre objet à bien été ajouté au panier !");
});