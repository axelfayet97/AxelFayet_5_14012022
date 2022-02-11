// Récupération des produits dans le localstorage : image, nom, couleur, quantité

let cart = JSON.parse(localStorage.getItem("product"));

// Si localstorage vide : afficher message "Panier Vide"
if (cart == null) {
    const itemsSection = document.getElementById("cart__items");
    const createH2 = document.createElement("h2");
    createH2.textContent = "Votre panier est vide !";
    itemsSection.appendChild(createH2);
} else {
    for (const element of cart) {
        fetch(`http://localhost:3000/api/products/${element.id}`)
            .then(res => {
                // Récupération du résultat de la requête et conversion en objet json
                return res.json();
            })
            .then(product => {
                //Promesse acceptée, récupération de ses produits
                displayCart(product, element);
                totalAmount(element.quantity, product.price);
            })
            .catch(err => {
                // Si une erreur survient
                console.log("Une erreur est survenue. " + err);
            });
    }
}

// Affichage récapitulatif produit : affichage des données produits
function displayCart(product, element) {
    const itemsSection = document.getElementById("cart__items");
    // Création dynamique des éléments des objets contenus dans le localstorage
    const createArticle = document.createElement("article");
    createArticle.setAttribute("data-id", element.id);
    createArticle.setAttribute("data-color", element.color);
    createArticle.classList.add("cart__item")
    itemsSection.appendChild(createArticle);

    // Création et gestion de la div image
    const createDivImg = document.createElement("div");
    createDivImg.classList.add("cart__item__img");
    createArticle.appendChild(createDivImg);

    // Image
    const createImgTag = document.createElement("img");
    createImgTag.setAttribute("src", product.imageUrl);
    createImgTag.setAttribute("alt", product.altTxt);
    createDivImg.appendChild(createImgTag);

    // Création et gestion de la div content
    const createDivContent = document.createElement("div");
    createDivContent.classList.add("cart__item__content");
    createArticle.appendChild(createDivContent);

    // Création et gestion de la div description
    const createDivDescription = document.createElement("div");
    createDivDescription.classList.add("cart__item__content__description");
    createDivContent.appendChild(createDivDescription);

    /*========== Description ==========*/
    // H2
    const createDescriptionTitle = document.createElement("h2");
    createDescriptionTitle.textContent = product.name;
    createDivDescription.appendChild(createDescriptionTitle);
    // p color
    const createDescriptionColor = document.createElement("p");
    createDescriptionColor.textContent = element.color;
    createDivDescription.appendChild(createDescriptionColor);
    //p prix
    const createDescriptionPrice = document.createElement("p");
    createDescriptionPrice.textContent = product.price + " €";
    createDivDescription.appendChild(createDescriptionPrice);

    /*========== Paramètres ==========*/
    // Création et gestion de la div parametres
    const createDivSettings = document.createElement("div");
    createDivSettings.classList.add("cart__item__content__settings");
    createDivContent.appendChild(createDivSettings);

    // Création et gestion de la div quantité
    const createDivQuantity = document.createElement("div");
    createDivQuantity.classList.add("cart__item__content__settings__quantity");
    createDivSettings.appendChild(createDivQuantity);

    // p quantité
    const createQuantityText = document.createElement("p");
    createQuantityText.textContent = "Qté : ";
    createDivQuantity.appendChild(createQuantityText);

    // Input quantité
    const createQuantityInput = document.createElement("input");
    createQuantityInput.setAttribute("type", "number");
    createQuantityInput.setAttribute("name", "itemQuantity");
    createQuantityInput.setAttribute("min", 1);
    createQuantityInput.setAttribute("max", 100);
    createQuantityInput.setAttribute("value", element.quantity);
    createQuantityInput.classList.add("itemQuantity");
    createDivQuantity.appendChild(createQuantityInput);



    // Création et gestion de la div suppression
    const createDivDelete = document.createElement("div");
    createDivDelete.classList.add("cart__item__content__settings__delete");
    createDivSettings.appendChild(createDivDelete);

    // Création et action bouton supprimer
    const createPDelete = document.createElement("p");
    createPDelete.classList.add("deleteItem");
    createPDelete.textContent = "Supprimer";
    createDivDelete.append(createPDelete);
    createPDelete.addEventListener("click", () => {
        console.log("clicked");
        // localStorage.removeItem("product");
        // Remove article with this data-id
    });
}

function totalAmount(quantity, price) {

    let totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerHTML = parseInt(totalQuantity.innerHTML) + quantity;

    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML = parseInt(totalPrice.innerHTML) + price * quantity;
}

// Gestion de la modification du champs quantité
// Ajouter qté en fonction de la modif valeur de l'input OK



// Addeventlistener sur input pour modification directe des champs articles & total
// Modification du localstorage ?

// Fonction pour retirer l'objet du panier
// rafraîchissement de la page à la suppression 0


// Récupération des champs données du client
// Utiliser Regex pour vérification des champs
// if form ok => click commander => afficher page cofirmation

// Génération d'un numéro de suivi
