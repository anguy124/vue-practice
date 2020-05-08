Vue.config.devtools = true
//global channel to send information, using to transfer information across the application 
var eventBus = new Vue()

//components: used to make our application more modular and easier to maintain as we build upon it
Vue.component('productDetails', {
    props: {
        details: {
            type: Array, 
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('product', {
    //waits for data coming from the parent(instance) 
    props: {
        //specify what data it's recieving
        premium: {
            type: Boolean,
            required: true 
        }
    },
    //instead of 'el', we use 'template' to specify the HTML
    template:         
        `<div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{ sale }}</p>
                <info-tabs :shipping="shipping" :details="details"></info-tabs>


                <p v-if="inStock > 10">In Stock</p>
                <p v-else-if="inStock <=10 && inStock >0">Almost out of stock!</p>
                <p v-else v-bind:class="{ outOfStock: !inStock }">Out of Stock</p>
                
                
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>

                <div class="color-box"
                    v-for="(variant,index) in variants" 
                    v-bind:key="variant.variantID"
                    v-bind:style="{ backgroundColor : variant.variantColor }"
                    v-on:mouseover="updateProduct(index)">
                </div>

                <button v-on:click="addToCart" 
                    v-bind:disabled="!inStock"
                    v-bind:class="{ disabledButton : !inStock } ">Add to Cart</button>

                <button v-on:click="removeFromCart">Remove Item</button>

            </div>

            <product-tabs v-bind:reviews="reviews"></product-tabs>

        </div> `,
    data() {
        return {
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedVariant: 0,
            details: ["80% cotton", "2% polyester", "gender neutral"],
            sizes: ["XS", "S", "MED", "L", 'XL'],
            variants: [
                {variantID: 1234, variantColor: 'green', variantImage: '/Users/annguyen/Desktop/vue practice/green-socks.png', variantQuantity: 10},
                {variantID: 5678, variantColor: 'blue', variantImage: '/Users/annguyen/Desktop/vue practice/blue-socks.png', variantQuantity: 5}
            ],
            onSale: true,
            reviews: []
        }
    },
    methods: {
        //function has power to emit this event and will be listened to 
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID)
        },
        updateProduct(index){ 
            this.selectedVariant = index
        },
        removeFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantID)
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
        },
        shipping(){
            if (this.premium){
                return "FREE SHIPPING"
            } else {
                return "2.99"
            }
        }

    },
    //code that you want run as soon as component is mounted to the DOM
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview) 
        })
    }
})


Vue.component('product-review', {
    template: 
     `<form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following error(s)</b>
        <ul>
            <li v-for="error in errors"> {{ error }}</li>
        </ul>
    </p>

     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name" placeholder="name">
     </p>
     
     <p>
       <label for="review">Review:</label>      
       <textarea id="review" v-model="review"></textarea>
     </p>
     
     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>

     <p> Would you recommend this product? </p>
        <label>Yes <input type="radio" value="Yes" v-model="recommend"/></label>
        <label>No <input type="radio" value="No" v-model="recommend"/></label>
     <p>
       <input type="submit" value="Submit">  
     </p>    
   
   </form>`,
    data(){
        return {
            name: null,
            review: null, 
            rating: null,
            errors: [],
            recommend: null
        }
    },
    methods: {
        onSubmit(){
            if (this.name && this.review && this.rating && this.recommend){
                let productReview = {
                    name: this.name, 
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
            else {
                 if (!this.name){
                    this.errors.push("Name is required.") 
                 } 
                 if (!this.review){
                    this.errors.push("Review is required.") 
                }
                if (!this.rating){
                    this.errors.push("Rating is required.") 
                }
                if (!this.recommend){
                    this.errors.push("Recommendation is required.")
                }
            }
        }
    }
})

//data to template ==> use V-BIND
//template to data ==> use V-MODEL (2-way binding, whenever the data changes, anywhere it's used the data will be updated)


Vue.component('product-tabs', {
    props:
    {
        reviews: {
            type: Array,
            required: false
        }
    },
    template:
    `<div>
        <span class="tab"
                v-bind:class="{ activeTab: selectedTab === tab }"
                v-for="(tab,index) in tabs"
                v-bind:key="index"
                @click="selectedTab = tab">{{ tab }}
        </span>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">No reviews yet!</p>
            <ul v-else>
                <li v-for="(review,index) in reviews" v-bind:key="index">
                    <p>{{ review.name }}</p>
                    <p>{{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    <p>{{ "Would you recommend this?" + " " + review.recommend }}</p>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab === 'Write a Review'" >
            <product-review></product-review>
        </div>

      
    </div>`,
    data(){
        return {
            tabs: ['Reviews', 'Write a Review'],
            selectedTab: 'Reviews',
        }
    }
})


Vue.component('info-tabs', {
    props: {
      shipping: {
        required: true
      },
      details: {
        type: Array,
        required: true
      }
    },
    template: `
      <div>
      
        <ul>
          <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
    
      </div>
    `,
    data() {
      return {
        tabs: ['Shipping', 'Details'],
        selectedTab: 'Shipping'
      }
    }
  })

//instances aka the heart of the app
var app = new Vue({
    //el is used to plug an element into the DOM
    el: '#app',
    //data outside of the component
    data: {
        premium: true, 
        cart: []
    },
    methods: {
        updateCart(id){
            //this now reflects cart in our instance's data 
            this.cart.push(id)
            console.log(id)
        },
        removeItem(id){
            for (var i = this.cart.length - 1; i >= 0; i--){
                if (this.cart[i] === id){
                    this.cart.splice(i,1)
                    console.log(id)
                }
            }
        }
    }
})