# Bamazon-node-app

Purpose:

To create an Amazon-like storefront with MySQL . The app takes in orders from customers and depletes stock from the store's inventory. The app also tracks product sales across the store's departments and gives the manager the ability to filter by low inventory, replenish inventory, and create inventory that was not previously available.

How to use:

Customer View:

This Node application is called bamazonCustomer.js.

 When app starts up, the customer is welcomed to the site and shown a list of all the available inventory with their item_id's, product_names, department_names, price, stock_items, and units_ordered.
 
 The app then prompt users with two messages:

The first asks them the ID of the product they would like to buy.
The second asks how many units of the product they would like to buy.

Once the customer has placed the order, the application checks if the store has enough of the product to meet the customer's request.

If not, the app responds with the message, "Insufficient quantity!", and then asks them to choose a different quantity.
However, if the store does have enough of the product, the customer's order goes through, the SQL database is updated to reflect the remaining quantity, and the customer's total cost of their purchase is displayed.

Customer is then prompted to continue or leave.

Manager View:

This Node application is called bamazonManager.js. Running this application will:

List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product

If a manager selects View Products for Sale, the app list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it list all items with an inventory count lower than five.
If a manager selects Add to Inventory, the app displays a prompt that will let the manager add more of any item currently in the store.
If a manager selects Add New Product, it  allows them to add a completely new product to the store.

Screenshot videos of working app are located in the video folder.

Dependencies:

mysql npm
inquirer npm
console.table npm
