$(document).ready(function content() {
  let ProductPrice = null;
  let ProductQuantity = null;
  let main = document.querySelector('.main');
  let productRow = '';
  let productList = '';
  let productItem = '';
  let productPriceTag = '';
  let rate = 0;
  let ratePrev = 0;

  let a = 'a,b'.split(',');
  console.log(a);

  //Функция рендер DOM
  $.getJSON('names.json', function (names) {
    getDataArray()
      .then((response) => {
        render(names, response);
      })
      .catch((e) => console.warn(e));
  });

  //Функция, обновляющая каждые 5 сек данные на странице
  setInterval(function () {
    $.getJSON('names.json', function (names) {
      getDataArray()
        .then((response) => {
          update(names, response);
        })
        .catch((e) => console.warn(e));
    });
  }, 5000);

  //Получаем данные с data.json массив Goods
  function getDataArray() {
    return new Promise((resolve, reject) => {
      $.getJSON('data.json')
        .done((response) => resolve(response.Value.Goods))
        .fail((error) => reject(error));
    });
  }

  function update(names, response) {
    let ProductPriceArr = [];
    ratePrev = rate;
    randomRate(24, 35);
    $.each(names, function (key, val) {
      let GroupID = key;
      let namesB = val.B;
      $.each(namesB, function (key, val) {
        let ProductId = key;
        let a = response.find((a, b, c) => {
          return a.T == ProductId && a.G == GroupID;
        });
        if (a != undefined) {
          ProductPrice = (a.C * rate).toFixed(2);
        } else {
          ProductPrice = 0;
        }
        ProductPriceArr.push(ProductPrice);
      });
    });
    priceCompare(rate, ratePrev);
    updatePrice(ProductPriceArr);
    updateCartPrice(rate);
    updateCartTotal();
  }

  function render(names, response) {
    randomRate(24, 35);
    $.each(names, function (key, val) {
      let GroupID = key;
      let NameGroup = val.G;
      let namesB = val.B;
      renderList(NameGroup);
      $.each(namesB, function (key, val) {
        let ProductId = key;
        let ProductName = val.N;
        let a = response.find((a, b, c) => {
          return a.T == ProductId && a.G == GroupID;
        });

        if (a != undefined) {
          ProductPrice = a.C;
          ProductQuantity = a.P;
        } else {
          ProductPrice = 0;
          ProductQuantity = 0;
        }
        renderItem(ProductName, ProductPrice, ProductQuantity, rate);
      });
    });
    ready();
    accordion();
  }

  //Функция, создает блок для группы товаров
  function renderList(NameGroup) {
    productRow = document.createElement('div');
    productRow.classList.add('js-product-row');
    productRowTitle = document.createElement('h2');
    productRowTitle.classList.add('js-product-row-title');
    productRowTitle.innerText = `${NameGroup}`;
    productList = document.createElement('ul');
    productList.classList.add('js-product-list');
    productRow.append(productRowTitle, productList);
    main.append(productRow);
  }

  //Функция, создает список продуктов
  function renderItem(ProductName, ProductPrice, ProductQuantity, rate) {
    productItem = document.createElement('li');
    productItem.classList.add('js-product-item');
    if (ProductQuantity == 0) {
      productItem.classList.add('not-active');
    }
    let productItems = `<h3 class="js-product-title">
                                ${ProductName}
                                <span class="js-product-quantity">(${ProductQuantity})</span>
                            </h3>
                            <p class="js-product-price" price="${ProductPrice}">${(
      ProductPrice * rate
    ).toFixed(2)} грн.</p>
                            <button class="js-product-btn">Add</button>
                        `;
    productItem.innerHTML = productItems;
    productList.append(productItem);
  }

  //Фукция обработчик событий кнопок Add, Remove, input Колличество товаров
  function ready() {
    let removeCartItemButtons = document.querySelectorAll('.cart-btn');
    for (let i = 0; i < removeCartItemButtons.length; i++) {
      let button = removeCartItemButtons[i];
      button.addEventListener('click', removeCartItem);
    }

    let quantityInputs = document.querySelectorAll('.cart-quantity');
    for (let i = 0; i < quantityInputs.length; i++) {
      let input = quantityInputs[i];
      input.addEventListener('change', quantityChanged);
    }

    let addToCartButtons = document.querySelectorAll('.js-product-btn');
    for (let i = 0; i < addToCartButtons.length; i++) {
      let button = addToCartButtons[i];
      button.addEventListener('click', addToCartClicked);
    }
    document
      .querySelector('.cart-purchase')
      .addEventListener('click', purchaseClicked);
  }

  //Событие нажатия на кнопку Купить
  function purchaseClicked() {
    alert('Спасибо за покупку');
    let cartItems = document.querySelectorAll('.cart-item');
    for (let a = 0; a < cartItems.length; a++) {
      cartItems[a].remove();
    }
    updateCartTotal();
  }

  //Функция события на кнопку Remove в корзине
  function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateCartTotal();
  }

  //Функция-рендер товара в корзине
  function updateCartTotal() {
    let cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      let cartItem = cartItems[i];
      let priceElement = cartItem.querySelector('.cart-price');
      let quantityElement = cartItem.querySelector('.cart-quantity');
      let price = parseFloat(priceElement.innerText.replace('$', ''));
      let quantity = quantityElement.value;
      total = total + price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.querySelector('.total-price').innerText = `${total}  грн.`;
  }

  //Функция изменения колличества товара в корзине
  function quantityChanged(event) {
    let input = event.target;
    let span = parseInt($(this).parent().prev().text().replace(/[^\d]/g, ''));
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    } else if (input.value > span) {
      input.value = span;
    }
    updateCartTotal();
  }

  function addToCartClicked(event) {
    let button = event.target;
    let shopItem = button.parentElement;
    let cartGroupName = shopItem.parentElement.parentElement;
    let titleCart = cartGroupName.querySelector('.js-product-row-title')
      .innerText;
    let title = shopItem.querySelector('.js-product-title').innerText;
    let namesC = parseFloat(
      shopItem.querySelector('.js-product-price').getAttribute('price')
    );
    let price = (namesC * rate).toFixed(2);
    addItemToCart(title, titleCart, price, namesC);
    updateCartTotal();
  }

  //Добавление товара в корзину
  function addItemToCart(title, titleCart, price, namesC) {
    let cartList = document.querySelector('.cart-list');
    let cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    let cart = document.querySelector('.cart');
    let cartTitles = cart.querySelectorAll('.cart-item-title');
    let cartQuantity = parseInt(title.replace(/[^\d]/g, ''));
    let cartQuantityString = '';
    if (cartQuantity <= 5) {
      cartQuantityString = 'Колличество товара ограничено';
    } else {
      cartQuantityString = '';
    }

    for (let i = 0; i < cartTitles.length; i++) {
      if (cartTitles[i].innerText == `${titleCart}. ${title}`) {
        alert('Товар в корзине');
        return;
      }
    }
    let cartRowContents = `
            <h3 class="cart-item-title">${titleCart}. ${title}</h3>
            <div class="cart-quantity-wrap">
              <input type="number" class="cart-quantity" value="1">
              <p>${cartQuantityString}</p>            
            </div>            
            <p class="cart-price" price="${namesC}">${price}<span> / шт.</span></p>
            <button class="cart-btn">Remove</button>`;
    cartItem.innerHTML = cartRowContents;
    cartList.append(cartItem);
    cartItem
      .querySelector('.cart-btn')
      .addEventListener('click', removeCartItem);
    cartItem
      .querySelector('.cart-quantity')
      .addEventListener('change', quantityChanged);
  }

  // Аккордион
  function accordion() {
    $('.js-product-list').hide();
    $('.js-product-list').first().show();
    $('.js-product-row-title').click(function () {
      $(this).nextAll().toggle();
    });
  }

  // Случаное число - курс доллара
  function randomRate(min, max) {
    rate = (Math.random() * (max - min) + min).toFixed(2);
    return rate;
  }

  //Сравнение цены и добавление классов для цены
  function priceCompare(rate, ratePrev) {
    let productPriceTitle = document.querySelectorAll('.js-product-price');
    for (let a = 0; a < productPriceTitle.length; a++) {
      if (rate < ratePrev) {
        productPriceTitle[a].classList.remove('increased');
        productPriceTitle[a].classList.add('decreased');
      } else if (rate == ratePrev || ratePrev == 0) {
        productPriceTitle[a].classList.remove('decreased');
        productPriceTitle[a].classList.remove('increased');
      } else {
        productPriceTitle[a].classList.remove('decreased');
        productPriceTitle[a].classList.add('increased');
      }
    }
  }

  //Обновление цены товара
  function updatePrice(ProductPriceArr) {
    productPriceTag = document.querySelectorAll('.js-product-price');
    for (let i = 0; i < productPriceTag.length; i++) {
      productPriceTag[i].innerText = `${ProductPriceArr[i]} грн.`;
    }
  }

  //Обновление цены товара в корзине
  function updateCartPrice(rate) {
    let cartItems = document.querySelectorAll('.cart-item');
    for (let i = 0; i < cartItems.length; i++) {
      let cartPrice = document.querySelectorAll('.cart-price');
      let actualPrice = cartPrice[i].getAttribute('price');
      cartPrice[i].innerText = `${(actualPrice * rate).toFixed(2)} грн.`;
    }
  }
});
