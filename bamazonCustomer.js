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

function readProducts() {
    console.log("\nWelcome to Bamazon.com!\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    });
}

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

function updateUnits() {
        var query = "UPDATE products SET units_ordered= " + order + " WHERE ?";
        connection.query(query, { item_id: id }, function (err, res) {
            readUpdated();
        });
}

function readUpdated() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.table(res);
        updateStockItems();
    });
}

function updateStockItems() {
    var query = "UPDATE products SET stock_quantity = stock_quantity - (SELECT   SUM(units_ordered)) WHERE item_id = ?";
    connection.query(query, id , function (err, res) {
        readUpdatedAgain();
    });
}
function readUpdatedAgain() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        yourTotal = price * order;
        console.table(res);
        console.log("\nYour total is: $" + yourTotal);
        resetUnitsOrdered();
    });
}
function resetUnitsOrdered() {
    var query = "UPDATE products SET units_ordered = 0 WHERE item_id = ?";
    connection.query(query, id , function (err, res) {
        
        
    });
}

