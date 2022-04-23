//code pour le serveur;
/**
 * this code needs to be running 24/7 for the server to be live @localHost:3333
 * 
 */
 
const express       = require('express');    // instancier le module express de express.js
const app           = express();             // assign a name to the function express that is an app.
const bodyParser    = require('body-parser');
const cors          = require('cors');
const port          = 3333;
//const {ExpressPeerServer} = require('peer');


// const peerServer = ExpressPeerServer(server, {
//     proxied: true,
//     debug: true,
//     path: '/',
//     ssl: {}
// });

//var MsgLstEncrypted = [];
var letters = {}; // type array.



//app.use(peerServer);
//Using the bodyParser as middleware:
app.use (express.static("public"));
app.use(express.json());
app.use(bodyParser.json()); // adds support to JSON-encoded bodies from client.
app.use(bodyParser.urlencoded({ extended: true })); // adds support to URL-encoded bodies from client.
app.use(cors());
app.use(express.static("public"));
/**
 * 
 */
app.get("/",(req,res)=>{
    res.send("Welcome to the Server! @Nicolas");
    res.json({name: "george"});
});
/**
 * 
 */
app.get("/getLetters", (req,res)=> {
    res.json(Object.values(letters));
});
/**
 * 
 */
app.post("/addLetter", bodyParser.text(), (req,res) => {
    console.log(typeof req.body);
    console.log(req.body);
    letters[req.body] = req.body;
    res.end();
});
/**
 * 
 */
  app.get("/peers",(req,res)=>{
      res.json(Object.values(letters));
  });


// $.getJSON('/peers', function(data){
//     var display = `Letters: ${data.body}<br>
//                    ID:<br>
//                    Title:<br>
//                    Completion_Status: ${data.completed}`
//     $(".display").html(display);
//   });


/**
 * 
 */
app.listen(port, () =>{
    console.log("SERVER CONSOLE: ");
    console.log(`listening on port ${port}`);
});


 /** 
  * This function below does the same thing as the one above:
  * APP.get('/', function (req, res){res.send('Hello World')}); 
  * */
//post is for creating:
// app.post("/addLetter", (req,res)=>{
//     console.log("addLetter req. received...");
//     console.log("Type of the request.body: "+ typeof req.body);
//     console.log(req.body);
//     MsgLstEncrypted.push(req.body);
//  });
/**
 * @getLetters needs to send to the user all the messages in the @MsgLstEncrypted
 */
// app.get("/getLetters", (req,res)=>{
//      console.log("getLetter req. received...");
//      res.contentType('application/json');
//      res.send(MsgLstEncrypted);
//  });

 /**
  * CMD command: "node index.js" => executes the server;
  * can also run without debugging through VisualStudioCode with node.js
  * can be accessed through a navigator with the input: http://localhost:4444/
  * the char : '`' (back tick) can be used to write a string on multiple lines that can represent a HTML DOC.
  */

 /**
  * NODE FORGE PACKAGE:
  * Node forge permet de faire de la cryptographie.
  * Installation: 
  * `npm install node-forge --save-dev`
  */    
 
 //console.log(req.headers);
    //console.log(req.url);
    //console.log(req.ip);
    //console.log(req.hostname);
    //console.log(req.body);
    //console.log(req.protocol); // http
    //console.log(req.method); //get
    //console.log(req.path); //path of url
    //console.log(req.subdomains); //test.sales.example.com ['test','sales']
    //console.log(req.query); //query string
    //console.log(req.params); // /user/72/product/23456
    //app.get("/user/:id"); 
    //req.params.id
    //res.status(404).end();
    //res.send()
