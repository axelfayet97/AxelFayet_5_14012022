// Création d'une requête API pour demander l'ensemble des produits.

fetch("http://localhost:3000/api/products/")
    // get promise
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    //promise OK : get promise's value
    .then(value => {
        // console.log("API OK", value);
        for (var products of value) {
            displayProducts(products)
        };
    })
    // if error then :
    .catch(err => {
        console.log('Une erreur est survenue.')
    });



// Création de de balises pour les produits

/* for products.title -> create <p></p> ?*/


function displayProducts(products) {
    class produit {
        constructor(colors, id, name, price, imageUrl, description, altTxt) {
            this.colors = colors;
            this.id = id;
            this.name = name;
            this.price = price;
            this.imageUrl = imageUrl;
            this.description = description;
            this.altTxt = altTxt;
        }
    }

    let newProduct = new produit(products.colors, products._id, products.name, products.price, products.imageUrl, products.description, products.altTxt);

    console.log(newProduct);

    const itemsSection = document.querySelector("#items");
    const createAnchor = document.createElement("a");
    itemsSection.appendChild(createAnchor).classList.add("item__content");
    const itemLink = document.getElementsByClassName("items__content");
}