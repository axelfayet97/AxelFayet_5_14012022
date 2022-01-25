// Récupération de l'url
var url = window.location.href;
var productId = new URL(url).searchParams.get("id");

// Création code page produits
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(res => {
        // Récupération du résultat de la requête et conversion en objet json
        return res.json();
    })
    .then(product => {
        //Promesse acceptée, récupération de ses produits
        displayProducts(product);
    })
    .catch(err => {
        // Si une erreur survient
        console.log("Une erreur est survenue." + err);
    });

// Fonction générant les produits trouvés dans l'API
function displayProducts(product) {
    // Ajout des options dans la balise select
    const targetSelect = document.getElementById("colors");
    const colorsArray = product.colors;
    for (let i = 0; i < colorsArray.length; i++) {
        let color = document.createElement("option");
        color.textContent = colorsArray[i];
        color.value = colorsArray[i];
        targetSelect.appendChild(color);
    }

    // Reparamétrage de la valeur du champs input
    document.getElementById("quantity").setAttribute("value", "1");

    // Ajout de la description dans la balise p
    const assignDescription = document.getElementById("description");
    assignDescription.textContent = product.description;

    // Ajout du prix dans la balise span
    const setPrice = document.getElementById("price");
    setPrice.textContent = product.price;

    // Ajout du titre de l'article
    const assignTitle = document.getElementById("title");
    assignTitle.textContent = product.name;

    // Création et ajout de l'image du produit
    const targetImg = document.querySelector(".item__img");
    const createImgTag = document.createElement("img");
    createImgTag.setAttribute("src", product.imageUrl);
    createImgTag.setAttribute("alt", product.altTxt);

    // Récupération du conteneur    
    const itemContainer = document.querySelector("section.item article");

    // Attribution du contenu à la balise article
    targetImg.appendChild(createImgTag);
    itemContainer.appendChild(assignTitle);
    itemContainer.appendChild(assignDescription);

    // Changement nom titre de la page
    document.title = product.name;

}


// Ajout d'un article au panier (localstorage)
// Au clic sur le bouton "Ajouter au panier"
let buttonAdd = document.getElementById("addToCart");
buttonAdd.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("product"));
    // On récupère les données dont on a besoin : prix, couleur & nombre d'article(s)
    let color = document.getElementById("colors");
    let price = document.getElementById("price").innerText;
    let quantity = document.getElementById("quantity").value;

    // Création de l'objet et attribution des valeurs à ajouter au localstorage
    const productToCart = Object.assign({
        id: `${productId}`,
        color: `${color.value}`,
        price: parseInt(price),
        quantity: parseInt(quantity)
    });

    // Vérification des champs renseignés
    // if (productToCart.quantity == 0) {
    //     alert("Veuillez sélectionner une quantité supérieure à 1");
    // } else if (productToCart.color == "") {
    //     alert("Veuillez sélectionner une couleur.");
    // } else {

        
    // Ajout des données du produit dans le localstorage
    if (cart == null) {
        cart = [];
        cart.push(Object.values(productToCart));
        localStorage.setItem("product", JSON.stringify(cart));
    } else {
        // Methode pour comparer les éléments de l'array cart 
        if (1 == 1) {
            for (let i of cart) {
                console.log(cart);
                productToCart.quantity++;
                console.log(productToCart);
                localStorage.setItem("product", JSON.stringify(cart))
            }
        }
    }
    // }
});
