const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
    owner: { 
        type: String, 
        required: true, 
        refs: 'Users',
    }, workspaceName: {
        type: String,
        required: true,
    },
    members:
[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
]
});


const collectionWorkspace = new mongoose.model('Workspace', WorkspaceSchema);
module.exports = collectionWorkspace;
