// Récupération des produits dans le localstorage : image, nom, couleur, quantité
let cart = JSON.parse(localStorage.getItem("products"));

// Si localstorage vide : afficher message "Panier Vide"
if (!cart || cart == 0 || cart == undefined) {
    const itemsSection = document.getElementById("cart__items");
    const createH2 = document.createElement("h2");
    createH2.textContent = "Votre panier est vide !";
    itemsSection.appendChild(createH2);
} else {
    for (const element of cart) {
        fetch(`http://localhost:3000/api/products/${element.id}`)
            .then(res => {
                // Récupération de la promesse
                return res.json();
            })
            .then(products => {
                //Promesse acceptée, appel des fonction
                displayCart(products, element);
                totalAmount(element.quantity, products.price);
                checkFormInformations();
            })
            .catch(err => {
                // Si une erreur survient
                console.log("Une erreur est survenue. " + err);
            });
    };
};

// Fonction permettant l'affichage des données des produits
function displayCart(product, element) {
    // Ciblage de la section cart__items
    const itemsSection = document.getElementById("cart__items");

    // Création dynamique des éléments des objets contenus dans le localstorage
    const createArticle = document.createElement("article");
    createArticle.setAttribute("data-id", element.id);
    createArticle.setAttribute("data-color", element.color);
    createArticle.classList.add("cart__item");
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

    // Texte quantité
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

    // Methode pour la gestion de la quantité
    createQuantityInput.addEventListener("change", (e) => {
        // Récupération du localstorage
        let productsStorage = JSON.parse(localStorage.getItem("products"));
        // Ciblage de la balise article la plus proche
        let closestArticle = e.target.closest("article");
        // Récupération des attributs data-id & data-color
        let productDataId = closestArticle.getAttribute("data-id");
        let productDataColor = closestArticle.getAttribute("data-color");
        // Boucle sur LocalStorage
        for (const index in productsStorage) {
            // Si l'ID et la couleur à leur index respectifs dans le localstorage correspondent à l'ID et la couleur de l'article ciblé 
            if (productsStorage[index].id == productDataId && productsStorage[index].color == productDataColor) {
                // Alors on définit la quantité sur la quantité saisie dans l'input
                productsStorage[index].quantity = parseInt(e.target.value);
                // Si la quantité est égale à 0 alors on retire l'article du panier
                if (productsStorage[index].quantity <= 0) {
                    // On retire cet élément du tableau
                    productsStorage.splice(productsStorage.indexOf(element), 1);
                }
                // On actualise ensuite les valeurs dans le localstorage
                localStorage.setItem("products", JSON.stringify(productsStorage));
            };
        };
        // On rafraichit la page
        location.reload();
    });

    // Création et gestion de la div suppression
    const createDivDelete = document.createElement("div");
    createDivDelete.classList.add("cart__item__content__settings__delete");
    createDivSettings.appendChild(createDivDelete);

    // Création et action bouton supprimer
    const createPDelete = document.createElement("p");
    createPDelete.classList.add("deleteItem");
    createPDelete.textContent = "Supprimer";
    createDivDelete.append(createPDelete);

    // Methode pour supprimer un item
    createPDelete.addEventListener("click", (e) => {
        // Récupération du localStorage
        let productsStorage = JSON.parse(localStorage.getItem("products"));
        console.log(productsStorage);
        for (let element of productsStorage) {
            // Ciblage de la balise article la plus proche
            let closestArticle = e.target.closest("article");
            // Récupération des attributs data-id & data-color
            let productDataId = closestArticle.getAttribute("data-id");
            let productDataColor = closestArticle.getAttribute("data-color");
            // Si l'élement dans le tableau possède la même couleur et le même ID que l'article ciblé
            if (element.color == productDataColor && element.id == productDataId) {
                // On retire cet élément du tableau
                productsStorage.splice(productsStorage.indexOf(element), 1);
            }
        }
        // Actualisation du localstorage + rafraichissement de la page
        localStorage.setItem("products", JSON.stringify(productsStorage));
        location.reload();
    });
};

// Gestion du Total
function totalAmount(quantity, price) {
    // Nombre d'articles
    let totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerHTML = parseInt(totalQuantity.innerHTML) + quantity;
    // Prix total
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML = parseInt(totalPrice.innerHTML) + price * quantity;
};

// Fonction récupérant les données de l'utilisateur dans le formulaire de contact
function checkFormInformations() {
    // Regexp
    let nameRegexp = new RegExp(/^[A-Za-zÀ-Ÿá-ÿ][A-Za-zÀ-Ÿá-ÿ-' ]+$/);
    let addressRegexp = new RegExp(/^[A-Za-zÀ-Ÿá-ÿ0-9][A-Za-zÀ-Ÿá-ÿ0-9,-/' ]+$/);
    let mailRegexp = new RegExp(/^([a-z0-9.-_]+)@([\da-z\.-]+)([a-z]{2,})$/);

    // Prénom
    let firstNameInput = document.getElementById("firstName");
    firstNameInput.addEventListener("change", (e) => {
        // On teste la valeur saisie sur le champs défini
        if (nameRegexp.test(e.target.value)) {
            // Réinitialisation du message d'erreur
            document.getElementById("firstNameErrorMsg").innerText = "";
            // Bouton "Commander" activé
            buttonIsDisabled(false);
        } else {
            // Affiche un message d'erreur
            document.getElementById("firstNameErrorMsg").innerText = "Veuillez vérifier le format du prénom : les chiffres et les caractères spéciaux ne sont pas acceptés.";
            // Bloque le bouton "Commander"
            buttonIsDisabled(true);
        };
    });
    // Nom
    let lastNameInput = document.getElementById("lastName");
    lastNameInput.addEventListener("change", (e) => {
        if (nameRegexp.test(e.target.value)) {
            document.getElementById("lastNameErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "Veuillez vérifier le format du nom : les chiffres et les caractères spéciaux ne sont pas acceptés.";
            buttonIsDisabled(true);
        };
    });
    // Adresse
    let addressInput = document.getElementById("address");
    addressInput.addEventListener("change", (e) => {
        if (addressRegexp.test(e.target.value)) {
            document.getElementById("addressErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("addressErrorMsg").innerText = "Format incorrect, veuillez saisir le nom de votre ville : les caractères spéciaux ne sont pas acceptés.";
            buttonIsDisabled(true);
        };
    });
    // Ville
    let cityInput = document.getElementById("city");
    cityInput.addEventListener("change", (e) => {
        if (nameRegexp.test(e.target.value)) {
            document.getElementById("cityErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("cityErrorMsg").innerText = "Veuillez vérifier le format de la ville : les chiffres et les caractères spéciaux ne sont pas acceptés.";
            buttonIsDisabled(true);
        };
    });
    // Email
    let emailInput = document.getElementById("email");
    emailInput.addEventListener("change", (e) => {
        if (mailRegexp.test(e.target.value)) {
            document.getElementById("emailErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("emailErrorMsg").innerText = "Veuillez vérifier le format de l'adresse e-mail.";
            buttonIsDisabled(true);
        };
    });
};

// Fonction permettant de désactiver le bouton "Commander" si un champs est incorrect
function buttonIsDisabled(disabled) {
    let orderInput = document.getElementById("order");
    if (disabled) {
        orderInput.setAttribute("disabled", true);
    } else {
        orderInput.removeAttribute("disabled");
    };
};

// Fonction permettant de récupérer et d'envoyer les données à l'API
function sendFormInformations() {
    // Déclaration des variables nécéssaires au traitement de la requete post
    let firstNameInput = document.getElementById("firstName").value;
    let lastNameInput = document.getElementById("lastName").value;
    let addressInput = document.getElementById("address").value;
    let cityInput = document.getElementById("city").value;
    let emailInput = document.getElementById("email").value;

    // Stockage des informations de contact dans un objet
    let contact = {
        firstName: firstNameInput,
        lastName: lastNameInput,
        address: addressInput,
        city: cityInput,
        email: emailInput
    };

    // Stockage des ID produits dans un tableau
    let products = [];
    for (const index in cart) {
        products.push(cart[index].id);
    };

    // On regroupe les informations de contact et le tableau contenant les ID dans data
    data = { contact, products };

    // Fetch de la commande  dans l'API en POST
    fetch(`http://localhost:3000/api/products/order`, {
        method: "POST",
        cors: "cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        // Corps de la requête
        body: JSON.stringify(data)
    })
        .then(res => {
            // Récupération de la promesse
            return res.json();
        })
        .then(promise => {
            // Résolution de la promesse par un ID de commande puis redirection de l'utilisateur vers la page confirmation
            JSON.stringify(promise);
            window.location = `./confirmation.html?order=${promise.orderId}`;
        })
        .catch(err => {
            // Si une erreur survient
            console.log("Une erreur est survenue. " + err);
        });
};

// Á l'envoi du formulaire on déclenche la fonction permettant d'envoyer les informations à l'API
document.querySelector("form").addEventListener("submit", (e) => {
    // Prévention du comportement par défaut du bouton
    e.preventDefault();
    // On vérifie si le panier n'es pas vide ou si la quantité est différente de 0
    if (!cart || cart == 0 || cart == undefined) {
        alert("Votre panier est vide, veuillez sélectionner un article.");
        return
    } else {
        sendFormInformations();
    };
});