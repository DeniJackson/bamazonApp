const mysql = require('mysql');
var inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'Newpanda12!',
    database: 'bamazon'

});


connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    runApp();
})

function runApp() {
    chooseItem();
}

function chooseItem() {
    connection.query("select * from products", function (error, results) {
        if (error) {
            console.log(error);
        }
     

        inquirer
            .prompt({
                type: "rawlist",
                name: 'choice',
                message: 'Enter the ID of what you would like to buy.',
                choices: function () {
                    var itemArray = [];
                    for (i = 0; i < results.length; i++) {
                        itemArray.push(results[i].item_id + ": Name: " + results[i].product_name + ' Price: ' + results[i].price_cost);
                    }
                    return itemArray;

                }
            }).then(function (answer) {


                var boughtItem;

                for (i = 0; i < results.length; i++) {
                    if (results[i].item_id + ": Name: " + results[i].product_name + ' Price: ' + results[i].price_cost == answer.choice) {
                        boughtItem = results[i];
                    }
                }

                inquirer
                    .prompt({

                        type: 'input',
                        name: 'quantity',
                        message: "How many would you like?",
                        validate: function (value) {
                            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 600) {
                                return true;
                            }
                            return false;
                        }


                    }).then(function (answer) {
                    
                     
                        newQuantity = boughtItem.stock_quantity - parseInt(answer.quantity);
                       
                        id = boughtItem.item_id;
                        sql =  "UPDATE products set stock_quantity = '"+newQuantity+"' where item_id ='"+id+"'";
                        console.log(sql)
                        if (newQuantity < 0) {
                                    console.log("Insufficient Quantity!!! Order cancelled.")
                            } else{
                                connection.query(sql, function(error,result){
                                    if(error) throw error;
                                    console.log(result.affectedRows+" records updated")
                                })
                                console.log(answer.quantity + ' units bought')
                                
                            }
                    })
            })
    })
}