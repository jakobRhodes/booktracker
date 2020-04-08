const express = require('express'); 
const app = express();
const {Pool} = require("pg");
const port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(__dirname + '/public'));
app.set('views', 'public/views');
app.set("view engine", "ejs");

//Web Endpoints
app.post('/addBook', displayResults);
app.post('/selectBooks', selectAllBooksFromDatabase);
app.post('/stats', displayStatistics);
app.listen(port, () => console.log(`Application is Listening on port ${port}!`));

function displayResults (req, res) {
    addNewBookToDatabase(req, res);
    selectLatestBookFromDatabase(req, res);
}

function displayStatistics (req, res) {
    var statsRequest = req.body.statOption;
    var SQL = "";
    console.log(req.body.statOption + "<-- Selected Option");
    switch (statsRequest) {
        case "Number of Books" :
            SQL = "SELECT COUNT(*) FROM BOOK";
            break;
        case "Favorite Author" :
            SQL = "SELECT author FROM book GROUP BY author ORDER BY COUNT(*) DESC LIMIT 1";
            break;
        case "Favorite Genre" :
            SQL = "SELECT genre FROM book GROUP BY genre ORDER BY COUNT(*) DESC LIMIT 1";
            break;
    }   
    selectFromDatabase(req, res, SQL);
}

function addNewBookToDatabase (req, res) {
const connectionString = process.env.DATABASE_URL || 'postgres://rbjaiulinstwdj:f189f4c73ef9dceabf44d5ce68ba252db3208b83f26bc277f4b6f24ca2893ba8@ec2-3-91-112-166.compute-1.amazonaws.com:5432/de9aegpl669co3?ssl=true';
const pool = new Pool({connectionString: connectionString});
var SQL = "INSERT INTO Book (Title, Author, Genre) VALUES ('" + String(req.body.bookTitle) + "', '" + String(req.body.bookAuthor) + "', '" + String(req.body.bookGenre) + "')";
console.log(SQL);
    pool.query(SQL, function(err, result) {
        // If an error occurred...
        if (err) {
        console.log("Error in body: ")
        console.log(err);
        }
        // Log this to the console for debugging purposes.
        console.log("1 record inserted");
        console.log(result.rows);
    });
} 

function selectAllBooksFromDatabase (req, res) {
const connectionString = process.env.DATABASE_URL || 'postgres://rbjaiulinstwdj:f189f4c73ef9dceabf44d5ce68ba252db3208b83f26bc277f4b6f24ca2893ba8@ec2-3-91-112-166.compute-1.amazonaws.com:5432/de9aegpl669co3?ssl=true';
const pool = new Pool({connectionString: connectionString});
var SQL = "SELECT * FROM Book";
console.log(SQL);
    pool.query(SQL, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in body: ")
            console.log(err);
        }
        // Log this to the console for debugging purposes.
        console.log("1 record selected");
        console.log(result.rows);
        console.log(result.rows.title);
        let book = result.rows;
        let bookJSON = JSON.stringify(book);
        res.end(bookJSON);
    }); 
}

function selectFromDatabase (req, res, SQL) {
    const connectionString = process.env.DATABASE_URL || 'postgres://rbjaiulinstwdj:f189f4c73ef9dceabf44d5ce68ba252db3208b83f26bc277f4b6f24ca2893ba8@ec2-3-91-112-166.compute-1.amazonaws.com:5432/de9aegpl669co3?ssl=true';
    const pool = new Pool({connectionString: connectionString});
    console.log(SQL);
        pool.query(SQL, function(err, result) {
            // If an error occurred...
            if (err) {
                console.log("Error in body: ")
                console.log(err);
            }
            // Log this to the console for debugging purposes.
            console.log("Records selected");
            console.log(result.rows[0]);
            let statsOption = result.rows[0];
            let statsOptionJSON = JSON.stringify(statsOption);
            res.end(statsOptionJSON);
        }); 
    }

    // To render an EJS page
    function selectLatestBookFromDatabase (req, res) {
        const connectionString = process.env.DATABASE_URL || 'postgres://rbjaiulinstwdj:f189f4c73ef9dceabf44d5ce68ba252db3208b83f26bc277f4b6f24ca2893ba8@ec2-3-91-112-166.compute-1.amazonaws.com:5432/de9aegpl669co3?ssl=true';
        const pool = new Pool({connectionString: connectionString});
        var SQL = "SELECT * FROM Book ORDER BY Book_ID DESC LIMIT 1";
        console.log(SQL);
            pool.query(SQL, function(err, result) {
                // If an error occurred...
                if (err) {
                    console.log("Error in body: ")
                    console.log(err);
                }
                // Log this to the console for debugging purposes.
                console.log("1 record selected");
                console.log(result.rows);
                console.log(result.rows.title);
                let book = result.rows[0];
                let bookJSON = JSON.stringify(book);
                let title = String(book.title);
                let author = String(book.author);
                let genre = String(book.genre);
                const params = {bookJSON: bookJSON, title: title, author: author, genre: genre};
                res.render('results', params);
            }); 
        }