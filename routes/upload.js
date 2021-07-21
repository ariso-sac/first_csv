var express = require('express');
var router = express.Router();
var csv = require("fast-csv");

const Product = require("../models/products");

/* GET users listing. */
router.get('/', function(req, res, next) {
    var  products  = []
    const csvStream = csv.format({ headers: true })
        .on("data", function(data){
         
         var item = new Product({
              name: data[0] ,
              price: data[1]   ,
              category: data[2],
              description: data[3],
              manufacturer:data[4] 
         });
         
          item.save(function(error){
            console.log(item);
              if(error){
                   throw error;
              }
          }); 

    }).on("end", function(){

    });
  
    csvStream.pipe(process.stdout).on('end', () => process.exit());
    res.json({success : "Data imported successfully.", status : 200});
});

module.exports = router;
