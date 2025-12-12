
const mongoose = require('mongoose');
const session = require("express-session")
const connect = mongoose.connect("mongodb+srv://leticiagomes_db_user:30112025@cluster0.mlklg47.mongodb.net/Login");

connect.then(() => {
    console.log("Conectado ao banco de dados MongoDB");
}).catch((err) => {
    console.log("Erro ao conectar ao banco de dados MongoDB: ", err);
});

const LoginSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    }, name: {
        type: String,
        required: true,
    },
    password: { 
        type: String, 
        required: true },
    workspace: [
        {
            type: String,
            ref: 'Workspace'
        }
    ]    
});




const collectionLogin = new mongoose.model('Users', LoginSchema);
module.exports = collectionLogin;

