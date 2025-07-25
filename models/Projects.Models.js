import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // người tạo dự án
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    tasksId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }], // danh sách công việc liên quan
})

const projectModel = mongoose.model('Projects', projectSchema);
export default projectModel;