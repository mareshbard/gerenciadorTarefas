
const mongoose = require('mongoose');



const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
    }, description: {
        type: String,
        required: true,
    },
    workspaceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true },
        status: {
        type: String,
        enum: ['done', 'doing', 'toDo'],
        default: 'toDo'
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Login',
            required: true
        }
});



const collectionTask = new mongoose.model('Task', TaskSchema);
module.exports = collectionTask;
