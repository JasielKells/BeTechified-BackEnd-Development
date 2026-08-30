const mongoose = require ('mongoose');

const todoSchema = new mongoose.Schema({
    task:{
        type: String,
        required: true,
        minlength: [1, 'Task cannot be empty']
    },
    completed:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true    //Automatically adds createdAt and updateAt
}); 

const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = TodoModel;