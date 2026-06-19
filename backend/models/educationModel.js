import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    field: { type: String, default: "" },
    institution: { type: String, required: true },
    year: { type: String, default: "" },
    grade: { type: String, default: "" },
    status: { type: String, default: "Completed" }, // "Completed" | "Pursuing"
    order: { type: Number, default: 0 },
});

const educationModel = mongoose.models.education || mongoose.model("education", educationSchema);

export default educationModel;
