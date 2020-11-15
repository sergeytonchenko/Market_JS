class Shop {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        selectors: {
          cart: '[data-cart]',
          main: '[data-main]',
        },
        rate: {
          min: 20,
          max: 80,
        },
      },
      options || {}
    );

    this.init();
  }

  init() {
    console.dir(this.options);
    console.log(this.rate);

    //request names
    //request data
    //render html
    //update => 15
  }

  get rate() {
    let { min, max } = this.options.rate;
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  render() {}

  update() {}

  getData() {
    const urlData = 'data.json';
    fetch(urlData)
      .then((response) => response.json())
      .then((data) => console.log(data.Value.Goods));
  }

  getNames() {
    const urlNames = 'names.json';
    fetch(urlNames)
      .then((response) => response.json())
      .then((names) => console.log(names));
  }

  cartTemplate() {
    return 'html';
  }
}

new Shop('dewadawdw');

function productTemplate(params) {
  return (productItem = `<ul class="product-list">
                          <li class="product-item>
                              <h3 class="product-title>
                                  <span class="product-quantity"></span>
                              </h3>
                              <p class="product-price></p>
                              <button class="product-btn></buton>
                          </li>
                        </ul>`);
}
