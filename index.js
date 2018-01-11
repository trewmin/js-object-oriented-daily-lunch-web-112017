
  let store = {customers: [], meals: [], deliveries: [], employers: []}

  let customer_id = 0
  class Customer {
    constructor(name, employer = {}) {
      this.id = ++customer_id
      this.employerId = employer.id
      this.name = name
      store.customers.push(this)
    }

    meals() {
      // returns all of the meals that a customer has had delivered
      return this.deliveries().map(delivery => delivery.meal())
    }

    deliveries() {
      return store.deliveries.filter(delivery => delivery.customer() === this)
    }

    totalSpent() {
      // returns the total amount that the customer has spent, as a function of the cost of the meals he has had delivered
      return this.meals().map(meal => meal.price).reduce((accumulator, currentValue) => accumulator + currentValue)
    }
  }

  let meal_id = 0
  class Meal {
    constructor(title, price) {
      this.title = title
      this.price = price
      this.id = ++meal_id
      store.meals.push(this)
    }

    deliveries() {
      return store.deliveries.filter(delivery => delivery.meal() === this)
    }

    customers() {
      return store.customers.filter(customer => customer.meals().includes(this))
    }

    static byPrice() {
      // A class method that orders the meals by their price
      const mealsArr = store.meals.slice(0)
      mealsArr.sort(function(a,b) {return b.price - a.price})
      return mealsArr
    }

  }

  let delivery_id = 0
  class Delivery {
    constructor(meal = {}, customer = {}) {
      this.id = ++delivery_id
      store.deliveries.push(this)
      this.mealId = meal.id
      this.customerId = customer.id
    }

    meal() {
      return store.meals.find(meal => meal.id === this.mealId)
    }

    customer() {
      return store.customers.find(customer => customer.id === this.customerId)
    }

  }

  let employer_id = 0
  class Employer {
    constructor(name) {
      this.name = name
      this.id = ++employer_id
      store.employers.push(this)
    }

    employees() {
      return store.customers.filter(customer => customer.employerId === this.id)
    }

    deliveries() {
      // returns a list of deliveries ordered by the employer's employees
      let deliveryArr = this.employees().map(employee => employee.deliveries())
      return [].concat.apply([], deliveryArr)
    }

    meals() {
      // returns a list of meals ordered by the employer's employees. The method is to not return the same meal multiple times.
      let mealsArr = this.employees().map(employee => employee.meals())
      mealsArr = [].concat.apply([], mealsArr)
      return [...new Set(mealsArr)]
    }

    mealTotals() {
      // returns a JavaScript object displaying each respective meal id ordered by the employer's employees. The keys of the JavaScript object are the meal ids and associated with each meal id is a value. For example, employerOne.mealTotals() returning an object of {1: 4, 2: 3} would mean that the meal with id of 1 was ordered by employerOne's employees four times, and the meal with id of 2 was ordered by employerOne's employees three times.
      let mealsArr = this.employees().map(employee => employee.meals())
      mealsArr = [].concat.apply([], mealsArr)
      let counts = {}

      for (let meal of mealsArr) {
        let mealId = meal.id
        counts[mealId] = counts[mealId] ? counts[mealId] + 1 : 1;
      }

      return counts
    }


  }
