import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Tiêu đề của sự kiện
    description: { type: String }, // Mô tả chi tiết
    type: { type: String, enum: ['TASK', 'SPRINT', 'PROJECT'], default: 'TASK', required: true }, // Loại sự kiện
    startDate: { type: Date, required: true }, // Ngày bắt đầu của sự kiện
    endDate: { type: Date, required: true }, // Ngày kết thúc của sự kiện
    projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }], // Liên kết với Project
    sprintId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprints' }], // Liên kết với Sprint
    tasksId: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Tasks'} ], // Danh sách công việc liên quan
})

const timelineModel = mongoose.model('Timelines', timelineSchema);
export default timelineModel;