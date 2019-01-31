var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//connection for sql database
var password = keys.mysql.password;
var connection = mysql.createConnection({
    host: "localhost",
    port: 8080,
    user: "root",
    password: password,
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected on id: " + connection.threadId);
});

var start = function() {
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;

        var table = new Table ({
            head: ["id", "product_name", "department_name", "price", "stock"],
            colWidths: [5, 25, 25, 25]
        });


        for (var i = 0; i < res.length; i++) {
            table.push([
                res[i].id,
                res[i].product_name,
                res[i].department_name,
                res[i].price,
                res[i].stock
            ]);
        }

        console.log(table.toString());

        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What is the ID of the product you'd like to buy?",
            validate: function(value) {
                if (isNan(value) == false) {
                    return true
                } else {
                    return false;
                }
            }
        }, {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNan(value) == false) {
                    return true
                } else { 
                    return false;
                }
            }
        }

        ]).then(function(answer){
            var quantity = answer.quantity;
            var itemId = answer.id;
            connection.query("SELECT * FROM products WHERE ?", [{
                id: itemId
            }], function (err, item){
                if (err) throw err;
                if (item[0].stock - quantity >= 0) {
                    var orderTotal = quantity * item[0].price;

                    console.log("Quantity in stock!");
                    console.log("Number in stock: " + item[0].stock + "Order quantity: " + quantity);
                    console.log("You will be charged $" + orderTotal + ". Thank you!");

                    connection.query("UPDATE products SET stock=? WHERE id=?", [item[0].stock - quantity, itemId],
                    function(err, inventory){
                        if (err) throw err;
                        orderAgain();
                    })
                } else {
                    console.log("Insufficient quantity. Please adjust your order. We have " + item[0].stock + " " + item[0].product_name + " in stock.");
                    orderAgain();
                }
            });
        });
    });
}

var orderAgain = function() {
    inquirer.prompt([{
        name: "orderAgain",
        type: "list",
        message: "Order again?",
        choices: ["Yes", "No"]
    }]).then(function(answer){
        if (answer.orderAgain === 'Yes') {
            start();
        } else {
            console.log("Thank you, come again!");
            connection.end();
        }
    })
}

start();