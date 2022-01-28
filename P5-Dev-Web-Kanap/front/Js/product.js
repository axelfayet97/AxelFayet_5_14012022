// Récupération de l'url

function getId() {
    var url = window.location.href;
    var productId = new URL(url).searchParams.get("id");
    return productId
}

// Création code page produits
fetch(`http://localhost:3000/api/products/${getId()}`)
    .then(res => {
        // Récupération du résultat de la requête et conversion en objet json
        return res.json();
    })
    .then(product => {
        //Promesse acceptée, récupération de ses produits + Appel de la fonction les générant
        displayProducts(product);
    })
    .catch(err => {
        // Si une erreur survient
        // Affichage d'une page d'erreur
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
        })

        mainContent.appendChild(createH1);
        mainContent.appendChild(createCTA);

        console.log("Une erreur est survenue." + err);
    });

// Fonction générant les produits trouvés dans l'API
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
    }

    // OPTIONNEL - Reparamétrage de la valeur du champs input
    document.getElementById("quantity").setAttribute("value", "1");

    // OPTIONNEL - Changement nom titre de la page
    document.title = product.name;
}

// Ajout d'un article au localstorage
// Au clic sur le bouton "Ajouter au panier"
const buttonAdd = document.getElementById("addToCart");
buttonAdd.addEventListener("click", () => {
    // On récupère les données dont on a besoin : prix, couleur & nombre d'article(s)
    const color = document.getElementById("colors").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const id = getId();
    const getLocalstorage = localStorage.getItem("product");
    let cart = [];

    // Vérification des champs renseignés
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
        cart = JSON.parse(getLocalstorage);
        let existProduct = false; $
        // Si un produit est déjà dans le locastorage
        for (const product of cart) {
            if (product.id == id && product.color == color) {
                product.quantity += quantity;
                existProduct = true;
            }
        }
        // Si un produit est déjà présent
        if (!existProduct) {
            cart.push({
                id: id,
                color: color,
                quantity: quantity
            })
        }
    } else {
        //Si aucun produit n'est présent, alors on crée un objet dans l'array cart
        cart = [{
            id: id,
            color: color,
            quantity: quantity
        }];
    }

    localStorage.setItem("product", JSON.stringify(cart))
    alert("Votre objet à bien été ajouté au panier !")
});