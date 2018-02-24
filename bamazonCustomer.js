var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var product;


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    readProducts();
});

//Helper function that displays current inventory
function readProducts() {
    console.log("\nWelcome to Bamazon.com!\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    });
}

//Helper function that captures the item_id of the product user wants to buy 
function runSearch() {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "What is the ID of the product you would like to buy?",
        })
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: answer.id }, function (err, res) {
                id = answer.id;
                price = res[0].price;
                console.log("\n ");
                console.table(res);
                console.log("\n ");
            howMuch();
            })
        });
};

//Helper function that captures the number of units of the stock_quantity the user wants to buy
function howMuch() {
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "How many units of this product would you like to buy?",
        })
        .then(function (answer) {
            var query = "SELECT stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: id }, function (err, res) {
                console.log("\n ");
                console.table(res);
                console.log("\n ");
                order = answer.quantity;
                if (res[0].stock_quantity >= order) {
                    updateUnits();
                }
                else {
                    console.log("\n Insufficient quantity!\n");
                    howMuch();
                }
            })
        });
};

//Helper function that captures the number of units oordered by the user
function updateUnits() {
        var query = "UPDATE products SET units_ordered= " + order + " WHERE ?";
        connection.query(query, { item_id: id }, function (err, res) {
            updateStockItems();
        });
}

//Helper function that updates the stock_quantity minus the units the user wants to buy
function updateStockItems() {
    var query = "UPDATE products SET stock_quantity = stock_quantity - (SELECT   SUM(units_ordered)) WHERE item_id = ?";
    connection.query(query, id , function (err, res) {
        readUpdated();
    });
}

//Helper function that displays the newly updated inventory and displays the total price for the user
function readUpdated() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        yourTotal = price * order;
        console.table(res);
        console.log("\nYour total is: $" + yourTotal + "\n");
        resetUnitsOrdered();
    });
}

//Helper function that resets the units_ordered to zero once the purchase is complete 
function resetUnitsOrdered() {
    var query = "UPDATE products SET units_ordered = 0 WHERE item_id = ?";
    connection.query(query, id , function (err, res) {
       reRun(); 
    });
}

//Helper function that prompts user to continue or end their session
function reRun() {
    inquirer
        .prompt({
            name: "restart",
            type: "confirm",
            message: "Do you want to continue?",
        })
        .then(function (answer) {
            restart = answer.restart;
            if (restart === true) {
                console.log("\n");
                readProducts();
            }
            else {
                console.log("\nGood-bye!")
            }
        });
}


