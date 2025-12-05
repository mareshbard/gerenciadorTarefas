const express = require('express')
const path = require("path")
const bcrypt = require("bcrypt")
const collectionLogin = require('./config')
const collectionWorkspace = require('./modelWorkspace')
const collectionTask = require('./modelTask')
const session = require("express-session")



const app = express()

//tranformando dados em json
app.use(express.json());
app.use(express.urlencoded(extended = false))

//criando session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}))

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
    const check = await collectionLogin.findOne({email: data.email});
if(check){
        res.send("Email já está sendo utilizado")
} else{
    const rounds = 10;
    const hashedSenha = await bcrypt.hash(data.password, rounds);
    data.password = hashedSenha;
    const userdata = await collectionLogin.insertMany(data);
    res.send("Cadastro realizado!")
    console.log(userdata)
}

})

app.post("/login", async (req, res)=>{
    try{
        const check = await collectionLogin.findOne({email: req.body.email});
        if(!check){
            res.send("Usuario não encontrado")
        }
        const senhaIgual = await bcrypt.compare(req.body.password, check.password);
        if(senhaIgual){
            
            req.session.user = {id: check._id, nome: check.name, email: check.email}
            res.redirect("/inicio")
        }else{
            res.send("senha errada");
        }
    } catch{
        res.send("wrong details")
    }
}
)

// app.post("/inicio", async (req,res) =>{
//     const taskdata = {
//         title: req.body.title,
//         description: req.body.description,
//         workspaceId: req.body.workspaceId
//     }
//     const taskuserdata = await collectionWorkspace.insertOne(taskdata);
//     res.send("Tarefa criada!")
//     }
// )
app.post("/inicio", async (req,res) =>{
    const taskdata = {
        title: req.body.title,
        description: req.body.description,
        workspaceId: 1
    }
    const taskuserdata = await collectionTask.create(taskdata);
    res.send("Tarefa criada!")
    console.log(taskuserdata)
    }
)
app.post("/inicio/criarWorkspace", async (req,res) =>{
    const Workspacedata = {
        owner: req.session.user.id,
        workspaceName: req.body.workspaceName,
        members: [req.session.user.id]
    }
    const workspaceuserdata = await collectionWorkspace.create(Workspacedata);
    res.send("Workspace criado!")
    console.log(workspaceuserdata)
    }
)



