$(document).ready(function content() {
    let idGroup;
    let idProduct;
    let ProductPrice;
    let ProductQuantity;
    let productItems;
    let productRow;
    let productRowTitle;
    let main = document.querySelector('.main');
    let productList;
    let value;
    let NamesIdGroup;
    let mainTitle;
    let productTitleNames;

    $.getJSON( "data.json", function( data ) {        
        for (let b = 0; b < data.Value.Goods.length; b++) {
            idGroup = data.Value.Goods[b].G;
            idProduct = data.Value.Goods[b].T; 
            ProductQuantity = data.Value.Goods[b].P; 
            ProductPrice = data.Value.Goods[b].C;             
            console.log(idGroup);
        }        
    });


    $.getJSON( "names.json", function( names ) { 
        $.each( names, function( key, val ) {
            NamesIdGroup = key;
            console.log(NamesIdGroup);
            value = val.B;
            mainTitle = val.G;
            productRow = document.createElement('div');
            productRow.classList.add('product-row');
            productRowTitle = document.createElement('h2');
            productRowTitle.classList.add('product-row-title');
            productRowTitle.innerText = (`${mainTitle}`);
            main.append(productRow);
            productRow.append(productRowTitle);  
            $.each( value, function( key, val ) {
                productTitleNames = val['N'];
                productList = document.createElement('div');
                productList.classList.add('product-list'); 
                productItems = `<div class="product-item">                                    
                                    <h3 class="product-title">
                                        ${productTitleNames}
                                        <span>(${ProductQuantity})</span>
                                    </h3>
                                    <p class="product-price">$1.15</p>
                                    <button class="product-btn">Add</button>
                                </div>                            
                                `;
                productList.innerHTML = productItems;
                productRow.append(productList);
            });            
        });     
        ready();
        $('.product-row-title').click(function(){
            $(this).nextAll().toggle();            
        });
    });

    
})

