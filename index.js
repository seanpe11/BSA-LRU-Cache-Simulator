const express = require('express')
const bodyParser = require('body-parser')

var app = express()
var port = process.env.port || 3000;
var hbs = require('express-handlebars')


app.engine('hbs', hbs({
    extname: 'hbs',
    defaultview: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}))

app.set('view engine', 'hbs')

app.set('port', process.env.PORT || 9090)

app.use(express.static(__dirname + '/public'))

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ----- [ SAMPLE QUERY, JUST COPY THIS FOR THE OTHERS ] ------
app.get('/', (req,res) => {
  res.render('index')
})

// -------------------------------------------------------

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});