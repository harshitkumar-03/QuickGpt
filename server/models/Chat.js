import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId:{type:String,ref:"user",required:true},
    
    username:{type:String,required:true},

    name:{type:String,required:true},

    messages:[
        {
            role:{type:String,required:true},

            content:{type:String,required:true},

            isImage:{type:Boolean,default:false},

            isPublished:{type:Boolean,default:false},

            timestamp:{type:Date,default:Date.now}
        }
    ]
},
{timestamps:true}
);

const Chat = mongoose.model("chat", chatSchema);

export default Chat;