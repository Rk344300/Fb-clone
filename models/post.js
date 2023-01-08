const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const POST_PATH = path.join('/uploads/users/posts');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    postpic: {
        type: String,
        required:true
    },
     // include the array of ids of all comments in this post schema itself
     comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps: true
});

let storage = multer.diskStorage({
    destination : function(req,file,cb){
        console.log(path.join(__dirname, '..', POST_PATH));
        cb(null,path.join(__dirname, '..', POST_PATH));
    },filename : function(req,file,cb){
        console.log(file);
        cb(null, file.mimetype.split("/")[0] + "-" + file.fieldname + '-' + Date.now());
    }
});

//static method

postSchema.statics.uploadedPostpic = multer({storage:storage,
    fileFilter:function(req,file,cb) {
        //checks if file type is image or video, then only allow else throw an error
    if(file.mimetype.split("/")[0] =='image' || file.mimetype.split("/")[0] =='video'){
        //for allowing upload of file
        cb(null, true);
    }
    else{
        //for reject file
        cb(null,false)  //passing an error instead of rejecting 
        
    }
}
}).single('postpic');



// postSchema.statics.uploadedPostpic = multer({storage : storage}).single('postpic');
postSchema.statics.postpath = POST_PATH;

postSchema.plugin(deepPopulate, {
    whitelist :[
        'comments.user',
        'comments.likes'
    ]
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;