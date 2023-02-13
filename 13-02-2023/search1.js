const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const { ejs } = require('ejs');
const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "studentDb"
})
const PORT = 6020;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/page', (req, res) => {

    

    var pid = req.params.id || 1;
    var limit = 10;
    var offset = (pid - 1) * limit;

    var count;
    var total_cnt;

    connection.query(`select * from st_table LIMIT 0,100 `, (err, result) => {
        if (err) throw err;
        res.render('search.ejs', { data: result });
    })
})
app.get('/search', (req, res) => {
    searchVal = req.query.searchVal;
    operator_sign=req.query.operator;
    console.log(operator_sign);
    console.log(searchVal);
    let symbol = ['^', '$', '%', '~', '_'];
    let newStr = "";
    var count=0;
    for (var i = 0; i < searchVal.length; i++) {
        if (symbol.includes(searchVal[i])) {
            newStr += " " + searchVal[i];
            count++;
        }
        else {
            newStr += searchVal[i];
        }
    }
    var spiltarr = newStr.split(' ');
    console.log(spiltarr);
    var queryans = "where";

    for (let val of spiltarr) {
        if (val[0] == "$" ) {
            
            count--;
            if(count)
            queryans += ` student_LastName LIKE '${val.substring(1)}%' and`
            else
            queryans += ` student_LastName LIKE '${val.substring(1)}%'`
        }
         if (val[0] == "^") {
        
            count--;
            if(count)
            queryans += ` student_firstName LIKE '${val.substring(1)}%' and`
            else
            queryans += ` student_firstName LIKE '${val.substring(1)}%'`

        }
         if (val[0] == "~") {
            if(count)
            queryans += ` student_contact LIKE '${val.substring(1)}%' and`
            else
            queryans += ` student_contact LIKE '${val.substring(1)}%'`

        }
         if (val[0] == "_") {
            count--;
            if(count)
            queryans += ` student_city LIKE '${val.substring(1)}%' and`
            else
            queryans += ` student_city LIKE '${val.substring(1)}%'`
        }
         if(val[0] == "%") {
            count--;
            if(count)
            queryans += ` student_clgName LIKE '${val.substring(1)}%' and`
            else
            queryans += ` student_clgName LIKE '${val.substring(1)}%'`
        }
    }
  console.log(queryans);
    connection.query(`select * from st_table ${queryans};`, (err, results) => {
        res.render('search.ejs', { data: results });
    })
});



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/page`);
})

connection.connect();


/*
 ^ firstName
 $ lastName
 _ city
 % college
*/