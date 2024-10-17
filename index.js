document.addEventListener('deviceready', function() {
    document.getElementById('scanButton').addEventListener('click', function() {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                // Affiche les résultats du scan
                fetchProductInfo(result.text);
            },
            function (error) {
                alert("Erreur de scan : " + error);
            },
            {
                preferFrontCamera : false, // iOS seulement
                showFlipCameraButton : true, // iOS seulement
                showTorchButton : true, // iOS seulement
                saveHistory: true, // Android seulement
                prompt : "Placez un code-barres dans le rectangle.", // Android seulement
                resultDisplayDuration: 500, // Android seulement
                formats : "QR_CODE,PDF_417", // formats supportés
                orientation : "portrait", // orientation
                disableAnimations : true, // désactiver les animations
                disableSuccessBeep: false // désactiver le bip de succès
            }
        );
    });
});

function fetchProductInfo(barcode) {
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                displayProductInfo(data.product);
            } else {
                alert("Produit non trouvé.");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            alert("Erreur lors de la récupération des données du produit.");
        });
}

function displayProductInfo(product) {
    document.getElementById('productName').textContent = `Nom du produit : ${product.product_name || "Non disponible"}`;
    document.getElementById('productDescription').textContent = `Description : ${product.generic_name || "Non disponible"}`;

    const productImage = document.getElementById('productImage');
    if (product.image_url) {
        productImage.src = product.image_url;
        productImage.style.display = 'block';
    } else {
        productImage.style.display = 'none';
    }

    document.getElementById('productInfo').style.display = 'block';
}
