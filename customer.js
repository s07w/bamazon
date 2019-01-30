require("dotenv").config();

var Table = require("cli-table2");
var inquirer = require("inquirer");
var mysql = require("mysql");
var keys = require("./keys.js");

var password = keys.mysql.password;

var connection = mysql.createConnection({
    host: "localhost",
    port: 8080,
    user: "root",
    password: password,
    database:"bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId + "\n");
    showProducts();
});

function showProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        var table = new Table({
            head: ["item_id", "product_name", "price"],
        });

        for (i = 0, i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price])
        }
        console.log(table.toString());
        buyProduct();
    });
}

function buyProduct() {
    inquirer.prompt([
    {
        name: "id",
        message: "What is the ID of the product you'd like to buy?",
    }, {
        name: "units",
        message: "How many units of that product would you like to buy?"
    }
]).then(function(answers){
    var id = answers.id;
    var units = answers.units;
        connection.query("SELECT * FROM products WHERE item_id = " + id, function(err, res){
            if (err) throw err;

            if (units > res[0].stock_quantity) {
                console.log("Insufficient quantity");
                connection.end();
            } else {
                connection.query("UPDATE products SET ? WHERE",
                [
                    {
                        stock_quantity: res[0].stock_quantity - units
                    },
                    {
                        item_id: id
                    }
                ],
                function(error) {
                    if(error) throw err;
                    console.log("Purchase complete!");
                    connection.query("UPDATE products SET ? WHERE",
                    [
                        {
                            product_sales: res[0].product_sales + res[0].price * units
                        },
                        {
                            item_id: id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                    }
                    );
                        console.log("You paid: $" + res[0].price * units);
                        connection.end();
                    }
                );
            }
        }
    )
});
}