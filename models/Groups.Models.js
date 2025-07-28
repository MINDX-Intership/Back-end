import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Unique identifier for the group
    name: { type: String, required: true }, // Name of the group
    description: { type: String, default: "" }, // Description of the group
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
})

const groupModel = mongoose.model('Groups', groupSchema);
export default groupModel;