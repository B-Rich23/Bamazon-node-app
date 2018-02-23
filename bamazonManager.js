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

                // case "Find all artists who appear more than once":
                //     multiSearch();
                //     break;

                // case "Add to Inventory":
                //     runSearch();
                //     break;

                // case "Search for a specific song":
                //     songSearch();
                //     break;
            }
        });
}

function artistSearch() {
    inquirer
        .prompt({
            name: "artist",
            type: "input",
            message: "What artist would you like to search for?"
        })
        .then(function (answer) {
            var query = "SELECT position, song, year FROM top5000 WHERE ?";
            connection.query(query, { artist: answer.artist }, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
                }
                runSearch();
            });
        });
}

function multiSearch() {
    var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].artist);
        }
        runSearch();
    });
}

function rangeSearch() {
    inquirer
        .prompt([{
            name: "start",
            type: "input",
            message: "Enter starting position: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "end",
            type: "input",
            message: "Enter ending position: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
        ])
        .then(function (answer) {
            var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
            connection.query(query, [answer.start, answer.end], function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        "Position: " +
                        res[i].position +
                        " || Song: " +
                        res[i].song +
                        " || Artist: " +
                        res[i].artist +
                        " || Year: " +
                        res[i].year
                    );
                }
                runSearch();
            });
        });
}

function songSearch() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
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
                // howMuch();
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
//             })
        });
});

// function updateUnits() {
//     var query = "UPDATE products SET units_ordered= " + order + " WHERE ?";
//     connection.query(query, { item_id: id }, function (err, res) {
//         readUpdated();
//     });
// }

// function readUpdated() {
//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;
//         // console.table(res);
//         updateStockItems();
//     });
// }

function updateStockItems() {
    var query = "UPDATE products SET stock_quantity = stock_quantity + " + order + " WHERE item_id = ?";
    connection.query(query, id, function (err, res) {
        readProducts();
    });
}
// function readUpdatedAgain() {
//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;
//         yourTotal = price * order;
//         console.table(res);
//         console.log("\nYour total is: $" + yourTotal);
//         resetUnitsOrdered();
//     });
// }
// function resetUnitsOrdered() {
//     var query = "UPDATE products SET units_ordered = 0 WHERE item_id = ?";
//     connection.query(query, id, function (err, res) {


//     });
// }

