var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "y131v0u4c!",
    database: "bamazon"
});

connection.connect(function(err) {
    // console.log("Connected as id: "+ connection.threadId);
    if (err) throw err;

});

var start = function() {
    inquirer.prompt([{

        type: "list",
        name: "mngrOption",
        message: "What would you like to do?",
        choices: [
            'View products for sale',
            'View low inventory',
            'Add to inventory',
            'Add new products',
            "Exit"
        ]
    }]).then(function(answer) {

        if (answer.mngrOption === 'View products for sale') {
            viewProd();
        } else if (answer.mngrOption === 'View low inventory') {
            viewLow();
        } else if (answer.mngrOption === 'Add to inventory') {
            addInv();
        } else if (answer.mngrOption === 'Add new products') {
            addProd();
        } else if (answer.mngrOption === "Exit") {
            console.log("Thanks! Have a great day.");
            process.exit();
        }
    });
};

var viewProd = function() {

    connection.query("SELECT * FROM products", function(err, results) {

        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock"],
            colWidths: [4, 35, 15, 8, 8]
        });
        // console.log("result" + results);

        for (var i = 0; i < results.length; i++) {
            table.push([results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock]);
        }

        console.log(table.toString());
        start();
    })
}

var viewLow = function() {
    connection.query("SELECT * FROM products", function(err, results) {

        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock"],
            colWidths: [4, 35, 15, 8, 8]
        });
        // console.log("result" + results);

        for (var i = 0; i < results.length; i++) {
            if (results[i].stock < 5) {
                table.push([results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock]);
            }
        }



        console.log(table.toString());
        start();
    })
}

var addInv = function() {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product Name", "Quantity"],
        });
        // console.log("result" + results);
        for (var i = 0; i < results.length; i++) {
            table.push([results[i].id, results[i].product_name, results[i].stock]);
        }

        console.log(table.toString());

        inquirer.prompt([{
            type: 'input',
            name: 'itemId',
            message: 'Which inventory would you like to add to? (Please enter the ID #)',
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true
                } else {
                    return false;
                }
            }
        }, {
            type: 'input',
            name: 'amount',
            message: 'How many would you like to add?',
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true
                } else {
                    return false;
                }
            }
        }]).then(function(answer) {

            connection.query('SELECT * FROM products WHERE ?', [{
                id: answer.itemId
            }], function(err, selectedItem) {
                if (err) throw err;
                console.log('You have added ' + answer.amount + ' ' + selectedItem[0].product_name + ' to the inventory.')
                connection.query('UPDATE products SET ? WHERE ?', [{
                    stock: parseInt(selectedItem[0].stock) + parseInt(answer.amount)
                }, {
                    id: answer.itemId
                }], function(err, inventory) {
                    if (err) throw err;
                    start();
                });

            });
        });
    })
}

var addProd = function() {

    inquirer.prompt([

        {
            type: 'input',
            name: 'prodAdd',
            message: 'What product would you like to add?'

        }, {

            type: 'input',
            name: 'deptAdd',
            message: 'In which department is this item?'

        }, {

            type: 'input',
            name: 'priceAdd',
            message: 'What will be its price?'

        }, {

            type: 'input',
            name: 'stockAdd',
            message: 'How many will be added to inventory?'
        }

    ]).then(function(answer) {

        connection.query('INSERT INTO products SET ?', {
            product_name: answer.prodAdd, 
            department_name: answer.deptAdd, 
            price: answer.priceAdd, 
            stock: answer.stockAdd
        }, function(err, res) {
            if (err) throw err;

            console.log(answer.prodAdd + ' added successfully!');
            start();
        });
    });

}
start();