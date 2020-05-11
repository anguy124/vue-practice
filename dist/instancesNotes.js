//instances aka the heart of the app
var app = new Vue({
    //el is used to plug an element into the DOM
    el: '#app',
    data: {
        product: 'Socks',
        brand: 'Vue Mastery',
        selectedVariant: 0,
        // image: '/Users/annguyen/Desktop/vue practice/green-socks.png',
        details: ["80% cotton", "2% polyester", "gender neutral"],
        sizes: ["XS", "S", "MED", "L", 'XL'],
        variants: [
            {variantID: 1234, variantColor: 'green', variantImage: '/dist/green-socks.png', variantQuantity: 10},
            {variantID: 5678, variantColor: 'blue', variantImage: '/dist/blue-socks.png', variantQuantity: 0}
        ],
        cart: 0,
        onSale: true
        // styleObject1: {
        //     color: 'purple',
        //     fontSize: '10px'
        // },
        // styleObject2: {
        //     color: 'pink',
        //     fontSize: '10px'
        // }
        // onSale: true
        // link: 'https://www.google.com/'
    },
    methods: {
        addToCart : function(){
            this.cart += 1
        },
        updateProduct(index){ 
            this.selectedVariant = index
        },
        removeFromCart(){
            this.cart -= 1
        }
    },
    computed: {
        title(){
            return this.brand + " " + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage 
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        }, 
        sale(){
            if (this.onSale = true){
                return this.brand + " " + this.product + " " + "is on sale!"
            } else {
                return this.brand + " " + this.product + " " + "is not on sale"
            }
        }

    }
})
    
    
