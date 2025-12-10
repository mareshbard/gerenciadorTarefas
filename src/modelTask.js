
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
        required: true }
});



const collectionTask = new mongoose.model('Task', TaskSchema);
module.exports = collectionTask;
