const express = require('express')
const path = require("path")
const bcrypt = require("bcrypt")
const collection = require('./config')
const { name } = require('ejs')
const session = require("express-session")
const { MongoDBStore } = require('connect-mongodb-session')
const MongoDBSession = require("connect-mongodb-session")
const MongoStore = require('connect-mongo')


const app = express()
const MongoURI = 'mongodb+srv://leticiagomes_db_user:30112025@cluster0.mlklg47.mongodb.net/Login'
//tranformando dados em json
app.use(express.json());
app.use(express.urlencoded(extended = false))

app.set('view engine', 'ejs')
const PORT = 5000



app.use(express.static("public"))
app.use(express.static("imgs"))
app.get('/', (req, res) => {
    res.render('login');
})
app.get('/inicio', (req, res) => {
    res.render('inicio');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

app.post("/signup", async (req,res) =>{

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const check = await collection.findOne({email: data.email});
if(check){
        res.send("Email já está sendo utilizado")
} else{
    const rounds = 10;
    const hashedSenha = await bcrypt.hash(data.password, rounds);
    data.password = hashedSenha;
    const userdata = await collection.insertMany(data);
    res.send("Cadastro realizado!")
    console.log(userdata)
}

})

app.post("/login", async (req, res)=>{
    try{
        const check = await collection.findOne({email: req.body.email});
        if(!check){
            res.send("Usuario não encontrado")
        }
        const senhaIgual = await bcrypt.compare(req.body.password, check.password);
        if(senhaIgual){
            res.send("entrou")
        }else{
            res.send("senha errada");
        }
    } catch{
        res.send("wrong details")


    }
}
)

