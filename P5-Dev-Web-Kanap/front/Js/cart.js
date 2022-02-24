// Récupération des produits dans le localstorage : image, nom, couleur, quantité
let cart = JSON.parse(localStorage.getItem("product"));
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
                // Récupération du résultat de la requête et conversion en objet json
                return res.json();
            })
            .then(product => {
                //Promesse acceptée, appel des fonction au chargement des produits
                displayCart(product, element);
                totalAmount(element.quantity, product.price);
            })
            .catch(err => {
                // Si une erreur survient
                console.log("Une erreur est survenue. " + err);
            });
    };
};

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
    // Methode pour gestion quantité
    createQuantityInput.addEventListener("change", (e) => {
        // Définition du localstorage
        let productStorage = JSON.parse(localStorage.getItem("product"));
        // Balise article la plus proche
        let closestArticle = e.target.closest("article");
        // Récupération des attributs data-id & data-color
        let productDataId = closestArticle.getAttribute("data-id");
        let productDataColor = closestArticle.getAttribute("data-color");
        // Boucle sur LocalStorage
        for (const element in productStorage) {
            if (productStorage[element].id == productDataId && productStorage[element].color == productDataColor) {
                productStorage[element].quantity = parseInt(e.target.value);
                // On remet les valeurs dans le localstorage
                localStorage.setItem("product", JSON.stringify(productStorage));
            };
        };
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
        // Définition du localStorage
        let productStorage = JSON.parse(localStorage.getItem("product"));
        for (let element in productStorage) {
            // Balise article la plus proche
            let closestArticle = e.target.closest("article");
            // Récupération des attributs data-id & data-color
            let productDataId = closestArticle.getAttribute("data-id");
            let productDataColor = closestArticle.getAttribute("data-color");
            console.log("Data-Id " + productDataId, "Data-color " + productDataColor);
            console.log("Product id " + productStorage[element].id, "Product Color " + productStorage[element].color);
            if (productStorage[element].color == productDataColor && productStorage[element].id == productDataId) {
                console.log(`Retire l'élément ${productDataColor}`);
                productStorage.splice(productStorage.indexOf(productStorage[element]), productStorage.indexOf(productStorage[element]));
                // Problème quand localstorage contient seulement 1 item, donc si index = 0 alors on utilise shift() qui supprime le 1er element de l'array
                if (productStorage.indexOf(productStorage[element]) == 0) {
                    productStorage.shift();
                    console.log("Shift premier item de l'array");
                }
            }
            // localStorage.setItem("product", JSON.stringify(productStorage));
        };
        // location.reload();
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

function getFormInformations() {
    // Récupération des champs données du client et utilisation de regex
    // Regexp
    let nameRegexp = new RegExp(/^\D+$/);
    let addressRegexp = new RegExp(/^[0-9][\w ,.'-].+$/);
    let mailRegexp = new RegExp(/^([a-z0-9.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);

    // Prénom
    let firstNameInput = document.getElementById("firstName");
    firstNameInput.addEventListener("change", (e) => {
        if (nameRegexp.test(e.target.value)) {
            document.getElementById("firstNameErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "Veuillez vérifier le format du prénom.";
            buttonIsDisabled(true);
        }
    });
    // Nom
    let lastNameInput = document.getElementById("lastName");
    lastNameInput.addEventListener("change", (e) => {
        if (nameRegexp.test(e.target.value)) {
            document.getElementById("lastNameErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "Veuillez vérifier le format du nom.";
            buttonIsDisabled(true);
        }
    });
    // Adresse
    let addressInput = document.getElementById("address");
    addressInput.addEventListener("change", (e) => {
        if (addressRegexp.test(e.target.value)) {
            document.getElementById("addressErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("addressErrorMsg").innerText = "Veuillez vérifier le format de l'adresse.";
            buttonIsDisabled(true);
        }
    });
    // Ville
    let cityInput = document.getElementById("city");
    cityInput.addEventListener("change", (e) => {
        if (nameRegexp.test(e.target.value)) {
            document.getElementById("cityErrorMsg").innerText = "";
            buttonIsDisabled(false);
        } else {
            document.getElementById("cityErrorMsg").innerText = "Veuillez vérifier le format de la ville.";
            buttonIsDisabled(true);
        }
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
        }
    });
    // Bouton commander
    let orderInput = document.getElementById("order");
    function buttonIsDisabled(disabled) {
        if (disabled) {
            orderInput.setAttribute("disabled", true);
            console.log("btn is disabled");
        } else {
            orderInput.removeAttribute("disabled");
        }
    }
    orderInput.addEventListener("change", buttonIsDisabled());

    // Stockage des données utilisateur
    // let contact = {
    //     cartContent: JSON.stringify(localStorage.getItem("product")),
    //     firstName: JSON.stringify(firstNameInput.value),
    //     lastName: lastNameInput.value,
    //     address: addressInput.value,
    //     city: cityInput.value,
    //     email: emailInput.value,
    // };
    // Génération d'un numéro de suivi

    // .then(res => {
    //     // Récupération du résultat de la requête et conversion en objet json
    //     return res.json();
    // })
    // .then(

    // })
    // .catch(err => {
    //     // Si une erreur survient
    //     console.log("Une erreur est survenue. " + err);
    // });
}
getFormInformations();

function sendFormInformations(e) {
    e.preventDefault();
    // Déclaration des variables nécéssaires au traitement de la requete post
    let firstNameInput = document.getElementById("firstName");
    let lastNameInput = document.getElementById("lastName");
    let addressInput = document.getElementById("address");
    let cityInput = document.getElementById("city");
    let emailInput = document.getElementById("email");

    // Stockage des valeurs + cart dans un objet
    for (const article in cart) {
        let articleId = cart[article].id;
        console.log(articleId);
        return articleId
    }
    let contact = {
        cartId: articleId,
        firstName: JSON.stringify(firstNameInput.value),
        lastName: lastNameInput.value,
        address: addressInput.value,
        city: cityInput.value,
        email: emailInput.value,
    };
    console.log(contact);
    fetch(`http://localhost:3000/api/products/order`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
    }).then(res => {
        // Récupération du résultat de la requête et conversion en objet json
        return res.json();
    })
        .catch(err => {
            // Si une erreur survient
            console.log("Une erreur est survenue. " + err);
        });
} document.querySelector("form").addEventListener("submit", sendFormInformations)