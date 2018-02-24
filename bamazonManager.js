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
    startApp();
});

function startApp() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    readProducts();
                    break;

                case "View Low Inventory":
                    multiSearch();
                    break;

                case "Add to Inventory":
                    // displayProducts();
                    runSearch();
                    break;

                case "Add New Product":
                    addProductName();
                    break;
            }
        });
}

function multiSearch() {
    var query = "SELECT item_id, stock_quantity, product_name FROM products GROUP BY item_id HAVING stock_quantity < 5";
    connection.query(query, function (err, res) {
        // for (var i = 0; i < res.length; i++) {
            // console.table(res[i].item_id);
            console.log("\n ");
            console.table(res);
        // }
        // runSearch();
    });
}

function readProducts() {
    console.log("\nInventory\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function runSearch() {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "What is the ID of the product you would like to update?",
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
            message: "How many units of this product would you like to replenish?",
        })
        .then(function (answer) {
            var query = "SELECT stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: id }, function (err, res) {
                console.log("\n ");
                console.table(res);
                console.log("\n ");
                order = answer.quantity;
                    updateStockItems();
            })
        });
};

function updateStockItems() {
    var query = "UPDATE products SET stock_quantity = stock_quantity + " + order + " WHERE item_id = ?";
    connection.query(query, id, function (err, res) {
        displayProducts();
    });
};

function addProductName() {
    inquirer
        .prompt({
            name: "newName",
            type: "input",
            message: "What is the new product name you want to create?",
        })
        .then(function (answer) {
                newName = answer.newName;
                console.log(newName);
                addDeptName();
    });
}

function addDeptName() {
    inquirer
        .prompt({
            name: "newDept",
            type: "input",
            message: "What is the new department name you want to create?",
        })
        .then(function (answer) {
                newDept = answer.newDept;
                addPrice();
    });
}
function addPrice() {
    inquirer
        .prompt({
            name: "newPrice",
            type: "input",
            message: "What is the new price you want to set?",
        })
        .then(function (answer) {
                newPrice = answer.newPrice;
                addQuantity();
    });
}

function addQuantity() {
    inquirer
        .prompt({
            name: "newQuantity",
            type: "input",
            message: "What is the new quantity you want to set?",
        })
        .then(function (answer) {
                newQuantity = answer.newQuantity;
                // createNewProduct();
    });
}


// function createNewProduct() {
//     var query = "INSERT INTO products (product_name, department_name, price, stock_quantity, units_ordered) VALUES (" + newName + ", " + newDept + ", " + newPrice + ", " + 35 + ", 0)";
//     connection.query(query, function (err, res) {
//         displayProducts();
//     });
// };

function displayProducts() {
    console.log("\nInventory\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
    });
}

