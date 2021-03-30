const express = require('express')  // Adding a express by runnig nmp install --save express
const path=require('path');
const http=require('http');
var bodyParser = require('body-parser')

 
var MongoClient = require('mongodb').MongoClient;

const app = express()  // Creating a exprss 
const port = 3000     // Assining the port numnber
var url = "mongodb://localhost:27017/mydb"; // database name is mydb
//Creating a post register API method with login
//setting middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + 'htmlfiles'));

//when running application, take it login page

app.get('/', function (req, response) {
    response.sendFile(path.join(__dirname,'./htmlfiles/login.html'));
  });


//when positing the login page
app.post('/', function (req, response) {
    var userName = req.body.username;
    var password = req.body.passwd;
  
     var data = { result : "default"};
    //Validate 
        if( userName == ""|| password == ""){
            response.statusCode = 404;
            data = { result : "empty values : failed"};
            console.log("empty values failed");  
            response.send(data)
        }else {
            MongoClient.connect(url, {useNewUrlParser:true }, function(err, db) { 
                if (err){
                    response.statusCode = 404;
                    data = { result : "Connection failed"};
                    console.log("Connection failed");  
                    response.send(data)
                }else {
                    var dbo = db.db("mydb"); 
                    var queryValues = { name: userName, password: password };  
                    dbo.collection("User").find(queryValues).toArray(function(err, res) 
                    {    
                        if(res.length == 0){
                           response.send("<h1>Recheck username and password!</h1>")  
                        } else {
                            response.send("<h1>Login successful </h1>")
                        }
                        
                    });                    

                }
            }); 

        }
       
  
  });

  app.get('/register', function (req, response) {
    response.sendFile(path.join(__dirname,'./htmlfiles/register.html'));
  });

app.post('/register', function (req, response) {
    // Get the name, emailId, password, and address from the request parameter which sent by post method from client
    var userName = req.body.username;
    var password = req.body.passwd;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var age=req.body.age;
    var email=req.body.email;
    var phoneno=req.body.mobileno;
    console.log(userName);
    var data = { result : "default"};
    //Validate 
        if( userName == ""|| password == ""){
            response.statusCode = 404;
            data = { result : "empty values : failed"};
            console.log("empty values failed");  
            response.send(data)
        }else {
            MongoClient.connect(url, {useNewUrlParser:true }, function(err, db) { 
                if (err){
                    response.statusCode = 404;
                    data = { result : "Connection failed"};
                    console.log("Connection failed");  
                    response.send(data)
                }else {
                    var dbo = db.db("mydb"); 
                    var myobj = { name: userName, password: password, fname: fname, lname: lname, age: age,email: email, phoneno:phoneno };  
                    dbo.collection("User").insertOne(myobj, function(err, res) 
                    {    
                        if (err){
                            response.statusCode = 404;
                            console.log("Insert failed");    
                            data = { result : "insert failed"};
                            response.send(data)
                        }else {  
                            console.log("1 document inserted");    
                            db.close(); 
                            response.statusCode = 200;
                            data = { result : "inserted DONE"} ;
                            response.sendFile(path.join(__dirname,'./htmlfiles/login.html'));
                        }
                    });                    

                }
            }); 

        }
       
  
  });

  
  app.listen(port, () => {    
      console.log(`Example app listening at http://localhost:${port}`)  
    })
