class Shop {
    constructor (options) {
      this.options = Object.assign({}, {
        selectors: {
          cart: '[data-cart]',
          main: '[data-main]'
        },
        rate: {
          min: 20,
          max: 80
        }
      }, options || {})

      this.init();
    }

    init () {
      console.dir(this.options);
      console.log(this.rate);

      //request names
      //request data
      //render html
      //update => 15
    }

    get rate () {
      let { min, max } = this.options.rate;
      return (Math.random() * (max - min) + min).toFixed(2);
    }

    render () {

    }

    update () {

    }

    getData() {

    }

    cartTemplate () {
      return 'html';
    }
  }

  new Shop('dewadawdw');