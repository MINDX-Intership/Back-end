import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: { type: String, required: true }, // ID của cuộc trò chuyện
    
})

const messageModel = mongoose.model('Messages', messageSchema);
export default messageModel;