
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
        type: String, 
        required: true }
});



const collectionTask = new mongoose.model('Task', TaskSchema);
module.exports = collectionTask;
