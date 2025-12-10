const express = require('express')
const bcrypt = require("bcrypt")
const MongoStore = require('connect-mongo').default
const collectionLogin = require('./config')
const collectionWorkspace = require('./modelWorkspace')
const collectionTask = require('./modelTask')
const session = require("express-session")
const{checkLogin}= require("./middlewares");




const URL = 'mongodb+srv://leticiagomes_db_user:30112025@cluster0.mlklg47.mongodb.net/Login'


const app = express()

//tranformando dados em json
app.use(express.json());
app.use(express.urlencoded(extended = false))

//criando session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: URL,
        collectionName: 'sessions',
        tt: 2 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 1000 * 60 *60 *24,
    }
}))

app.set('view engine', 'ejs')
const PORT = 5000



app.use(express.static("public"))
app.use(express.static("imgs"))
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/inicio', (req, res) => {
    res.render('inicio');
})
app.get('/workspaces', checkLogin, (req, res) => {
    res.render('workspaces');
})
app.get('/tasks', checkLogin, (req, res) => {
    res.render('tasks');
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
        password: req.body.password,
        workspace: []
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
    res.redirect("/login");
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
            res.redirect("/workspaces");
        }else{
            res.send("senha errada");
        }
    } catch{
        res.send("wrong details")
    }
}
)

app.post("/createTask", checkLogin, async (req,res) =>{
    const taskdata = {
        title: req.body.title,
        description: req.body.description,
        workspaceId: req.body.workspaceId
    }
    const taskuserdata = await collectionTask.create(taskdata);
    res.send("Tarefa criada!")
    console.log(taskuserdata)
    }
)
app.post("/createWorkspace", checkLogin, async (req,res) =>{
    const Workspacedata = {
        owner: req.session.user.id,
        workspaceName: req.body.workspaceName,
        members: [req.session.user.id],
        password: req.body.password
    }

    const checkWorkspace = await collectionWorkspace.findOne({workspaceName: Workspacedata.workspaceName});
    //verificando se existe algum workspace
    if(!checkWorkspace){
    const rounds = 10;
    const hashedSenha = await bcrypt.hash(Workspacedata.password, rounds);
    Workspacedata.password = hashedSenha;
    const workspaceuserdata = await collectionWorkspace.create(Workspacedata);
    res.send("Workspace criado!")
    console.log(workspaceuserdata)
    // req.session.user.workspace.push(workspaceuserdata._id)
    await collectionLogin.updateOne(
    { _id: req.session.user.id },
    { $push: {workspace: workspaceuserdata._id } }
);
    console.log(req.session.user);
     
    } else{

    const checkPassword = await bcrypt.compare(req.body.password, checkWorkspace.password);
    console.log("checkPassword:", checkPassword);
    if(checkWorkspace && checkPassword){
            res.send("Workspace já criado");
        } else{
    const rounds = 10;
    const hashedSenha = await bcrypt.hash(Workspacedata.password, rounds);
    Workspacedata.password = hashedSenha;
    const workspaceuserdata = await collectionWorkspace.create(Workspacedata);
    res.send("Workspace criado!")
    console.log(workspaceuserdata)
    // req.session.user.workspace.push(checkWorkspace._id)
    collectionLogin.updateOne(
    { _id: req.session.user.id },
    { $push: {workspaces: workspaceuserdata._id} }
);
    console.log(req.session.user);
        }
    }
    }
)

app.get('/workspace/:id', checkLogin, async (req, res) => {
    const workspaceId = req.params.id;
    const tasks =  await collectionTask.find({workspaceId: workspaceId});
    const workspace = await collectionWorkspace.findById(workspaceId);

    res.render('tasks', {
        workspaceName: workspace.workspaceName,
        workspaceId: workspace._id,
        listTasks: tasks 
    })
});


