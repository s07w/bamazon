var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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

var start = () => {
    inquirer.prompt([{
        type: "list",
        name:"mgrOption",
        message: "What would you like to do?",
        choices: [
            "View products for sale",
            "View low inventory",
            "Add to inventory",
            "Add new products",
            "Exit"
        ]
    }]).then(function(answer){
        switch (answer.action) {
            case "View products for sale":
            viewProducts();
            break;

            case "View low inventory":
            viewLow();
            break;

            case "Add to inventory":
            addInv();
            break;

            case "Add new products":
            addProd();

            //check
            case "Exit":
            connection.end();
        }
    });
};

var viewProducts = () => {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock"],
            colWidths: [4, 25, 25, 8, 8]
        });
        //console.log("result" + res);

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock]);
        }

        console.log(table.toString());
        start();
    })
}

var viewLow = () => {
    connection.query("SELECT * FROM products", function (err, rest){
        if (err) throw err;

        var table = new Table({
            head:["ID", "Product Name", "Department", "Price", "Stock"],
            colWidths: [4, 25, 25, 8, 8]
        });
        //console.log("result" + res);

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock < 5) {
                table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock]);
            }
        }

        console.log(table.toString());
        start();
    })
}

var addInv = () => {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        var table = new Table ({
            head:["ID", "Product Name", "Department", "Price", "Stock"],
            colWidths: [4, 25, 25, 8, 8]
        });
        //console.log("result" + res);
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].stock]);
        }
        
        console.log(table.toString());

        inquirer.prompt([{
            type: "input",
            name: "itemId",
            message: "Which inventory would you like to add to? Please enter the ID number.",
            validate: function(value) {
                if(isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            type: "input",
            name: "amount",
            message: "How many would you like to add?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }

        }]).then(function(answer){
            connection.query("SELECT * FROM products WHERE ?", [{
                id: answer.itemId
            }], function(err, item) {
                if (err) throw err;
                console.log("You have added " + answer.amount + " " + item[0].product_name + " to the inventory.")
                connection.query("UPDATE products SET ? WHERE ?", [: parseInt(i) + parseInt(answer.amount)
                }, {
                    id: answer.itemId
                }], function(err, inventory){
                    if (err) throw err;
                    start();
                });
            });
        });

    })
}

var addProd = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "productAdd",
            message: "What product would you like to add?"
        }, {
            type: "input",
            name: "deptAdd",
            message: "In which department is this item?"
        }, {
            type: "input",
            name: "priceAdd",
            message: "What will be its price?"
        }, {
            type: "input",
            name: "stockAdd",
            message: "How many will be added to our inventory?"
        }
    ]). then(function(answer){

        connection.query("INSERT INTO products SET ?", {
            product_name: answer.productAdd,
            department_name: answer.deptAdd,
            price: answer.priceAdd,
            stock: answer.stockAdd
        }, function(err, res){
            if (err) throw err;

            console.log(answer.productAdd + " added successfully!");
            start();
        });
    });
}

start();