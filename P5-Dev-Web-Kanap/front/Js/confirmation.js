// On vide le panier à la commande
localStorage.removeItem("products");

// Fonction récupérant le numéro de commande à partir de l'url
function getOrder() {
    var url = window.location.href;
    var productsOrder = new URL(url).searchParams.get("order");
    return productsOrder;
};

// Affichage du numéro de commande dans le champs prévu à cet effet
document.getElementById("orderId").textContent = getOrder();
