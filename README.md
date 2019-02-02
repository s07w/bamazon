# Bamazon, a Node app with MySql 
This app uses Node and npm dependencies in concert with MySql to simulate purchases as a customer. I also did the bonus work so that the user has manager privileges with more nuanced options. The npm dependencies used were inquirer, mysql, dotenv (to store MySql password information privately) and Cli-Table.

## Customer.js

![GIF of customer demo](https://raw.githubusercontent.com/s07w/bamazon/master/demo.gif)

This app displays a table of available products. The customer selects the ID of the item they'd like to purchase, quantity, and confirms the purchase. The table is then updated for its quantity.

## Manager.js

![GIF of manager demo](https://raw.githubusercontent.com/s07w/bamazon/master/demo2.gif)

This app gives the user manager options. The user can view low inventory, add to existing inventory, and create new items for purchase. 

## Challenges

This app was tougher than I expected, as it had a number of moving parts. Troubleshooting required making sure each element of the app was working properly, and this took time. 

## Technologies Used
MySql Workbench, Javascript, NPM dependencies, Node
