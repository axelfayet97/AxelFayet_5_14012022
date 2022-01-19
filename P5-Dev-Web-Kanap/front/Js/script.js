// Création d'une requête API pour demander l'ensemble des produits.

fetch("http://localhost:3000/api/products/")
    // get promise
    .then(res => {
        return res.json();
    })
    //promise OK : get promise's value
    .then(value => {
        for (var products of value) {
            displayProducts(products);
        };
    })
    // if error then :
    .catch(err => {
        console.log('Une erreur est survenue.')
    });



// Création de de balises pour les produits

const itemsSection = document.getElementById("items");
const createArticle = document.createElement("article");
const createh3Title = document.createElement("h3");
createh3Title.classList.add("productName");
const createImgTag = document.createElement("img");
const createPTag = document.createElement("p");
createPTag.classList.add("productDescription");


// Fonction générant les produits trouvés dans l'API

function displayProducts(products) {

    //URL en fonction de "URLSearchParam"
    
    itemsSection.innerHTML += `<a href='./product.html?id=${products._id}'></a>`;

    let articleBody = document.querySelector("#items a").appendChild(createArticle);
    articleBody.appendChild(createImgTag).src = `${products.imageUrl}`;
    articleBody.appendChild(createImgTag).alt = `${products.altTxt}`;
    articleBody.appendChild(createh3Title).innerText = `${products.name}`;
    articleBody.appendChild(createPTag).innerText = `${products.description}`;
}


//Déclaration d'un objet
// class kanap {
//     constructor(colors, id, name, price, imageUrl, description, altTxt) {
//         this.colors = colors;
//         this.id = id;
//         this.name = name;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.altTxt = altTxt;
//     }

//     printDescription() {
//         console.log(`Description : ${this.description}`);
//     }

// myProducts() {

// }

    // let canapes = new kanap(products.colors, products.id, products.name, products.price, products.imageUrl, products.description, products.altTxt);

    // canapes.printDescription();
    // canapes.myProducts();


    // console.log("produit : " + products);

