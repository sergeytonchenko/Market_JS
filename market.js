$(document).ready(function content() {
    let arrDataGoods = []; 
    let DataIdGroup = null;
    let ProductPrice = null;
    let DataIdProduct = null;
    let ProductQuantity = null;
    let main = document.querySelector('.main');
    let productRow = '';
    let productList = '';
    let productItem = '';

    $.getJSON( "names.json", function( names ) { 
        getDataArray().then((response) => {
            render(names, response)
        }).catch(e => console.warn(e));    
    });
    
    function render(names, response) {
        $.each( names, function( key, val ) {
            let GroupID = key;
            let NameGroup = val.G;
            let namesB = val.B;            
            renderList(NameGroup);            
            $.each( namesB, function( key, val ) {
                let ProductId = key;
                let ProductName = val.N; 
                let a = response.find((a, b, c) => {
                    return a.T == ProductId && a.G == GroupID;
                })
                
                if (a != undefined) {
                    ProductPrice = a.C;
                    ProductQuantity = a.P;
                } else {
                    ProductPrice = 0;
                    ProductQuantity = 0;                    
                }                
                renderItem(ProductName, ProductPrice, ProductQuantity, productRow);
            });            
        });
        ready();
        $('.product-list').hide();
        $('.product-row-title').click(function(){
            $(this).nextAll().toggle();            
        });  
    }

    function getDataArray () {
        return new Promise((resolve, reject) => {
            $.getJSON( "data.json")
            .done(response => resolve(response.Value.Goods))
            .fail(error => reject(error))
        });
    }

    function renderList(NameGroup) {
        productRow = document.createElement('div');
        productRow.classList.add('product-row');
        productRowTitle = document.createElement('h2');
        productRowTitle.classList.add('product-row-title');
        productRowTitle.innerText = (`${NameGroup}`);
        productList = document.createElement('div');
        productList.classList.add('product-list'); 
        productRow.append(productRowTitle, productList);
        main.append(productRow);
    }
    function renderItem(ProductName, ProductPrice, ProductQuantity, productRow) {       
        productItem = document.createElement('div');
        productItem.classList.add('product-item');
        if (ProductQuantity == 0) {
            productItem.classList.add('not-active');
        } 
        let productItems = `<h3 class="product-title">
                                ${ProductName}
                                <span class="product-quantity">(${ProductQuantity})</span>
                            </h3>
                            <p class="product-price">${ProductPrice}</p>
                            <button class="product-btn">Add</button>
                        `;
        productItem.innerHTML = productItems;
        productList.append(productItem);        
    }
    
    function ready() {
    

        let removeCartItemButtons = document.querySelectorAll('.cart-btn');
        for (let i = 0; i < removeCartItemButtons.length; i++) {
            let button = removeCartItemButtons[i];
            button.addEventListener('click', removeCartItem)
        }
    
        let quantityInputs = document.querySelectorAll('.cart-quantity');
        for (let i = 0; i < quantityInputs.length; i++) {
            let input = quantityInputs[i];
            input.addEventListener('change', quantityChanged)
        }
    
        let addToCartButtons = document.querySelectorAll('.product-btn');
        for (let i = 0; i < addToCartButtons.length; i++) {
            let button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
    
        document.querySelector('.cart-purchase').addEventListener('click', purchaseClicked);     
    };
    
    
    function purchaseClicked() {
        alert('Спасибо за покупку');    
        let cartItems = document.querySelectorAll('.cart-item');    
        for (let a = 0; a < cartItems.length; a++) {
            cartItems[a].remove();
            
        }    
        updateCartTotal();   
    }
    
    function removeCartItem(event) {
        let buttonClicked = event.target
        buttonClicked.parentElement.remove();
        updateCartTotal();
    }
    
    function updateCartTotal() {    
        let cartItems = document.querySelectorAll('.cart-item');
        let total = 0;
        for (let i = 0; i < cartItems.length; i++) {
            let cartItem = cartItems[i];
            let priceElement = cartItem.querySelector('.cart-price');
            let quantityElement = cartItem.querySelector('.cart-quantity');
            let price = parseFloat(priceElement.innerText.replace('$', ''));
            let quantity = quantityElement.value;
            total = total + (price * quantity);
        }
        total = Math.round(total * 100) / 100
        document.querySelector('.total-price').innerText = '$' + total;
    }
    
    function quantityChanged(event) {        
        let input = event.target;
        let span = parseInt($(this).prev().prev().text().replace(/[^\d]/ig, ''));
        console.log(span);
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1            
        } else if (input.value > span) {
            input.value = span
        }
        updateCartTotal()
    }
    
    function addToCartClicked(event) {
        let button = event.target;
        let shopItem = button.parentElement;
        let title = shopItem.querySelector('.product-title').innerText;
        let price = shopItem.querySelector('.product-price').innerText;    
        addItemToCart(title, price);
        updateCartTotal()
    }
    
    function addItemToCart(title, price) {
        let cartList = document.querySelector('.cart-list');
        let cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        let cart = document.querySelector('.cart');
        let cartTitles = cart.querySelectorAll('.cart-item-title');
        for (let i = 0; i < cartTitles.length; i++) {
            if (cartTitles[i].innerText == title) {
                alert('Товар в корзине');
                return
            }
        }
        let cartRowContents = `
            <h3 class="cart-item-title">${title}</h3>
            <p class="cart-price">${price}</p>
            <input type="number" class="cart-quantity" value="1">
            <button class="cart-btn">Remove</button>`;
        cartItem.innerHTML = cartRowContents;
        cartList.append(cartItem);
        cartItem.querySelector('.cart-btn').addEventListener('click', removeCartItem);
        cartItem.querySelector('.cart-quantity').addEventListener('change', quantityChanged);
    }
})