const express = require('express'); 
const app = express();
const {Pool} = require("pg");
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.set('views', 'public/views');
app.set("view engine", "ejs");

//Web Endpoint
app.get('/addBook', addNewBookToDatabase);
app.listen(port, () => console.log(`Application is Listening on port ${port}!`));

function addNewBookToDatabase (req, res) {
const connectionString = process.env.DATABASE_URL || 'postgres://rbjaiulinstwdj:f189f4c73ef9dceabf44d5ce68ba252db3208b83f26bc277f4b6f24ca2893ba8@ec2-3-91-112-166.compute-1.amazonaws.com:5432/de9aegpl669co3?ssl=true';
const pool = new Pool({connectionString: connectionString});
var SQL_INSERT = "INSERT INTO Book (Title, Author, Genre) VALUES (" + req.query.bookTitle + "," + req.query.bookAuthor + "," + req.query.bookGenre + ")";
pool.query(SQL_INSERT, function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }
    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(result.rows);
 });
 
} 

