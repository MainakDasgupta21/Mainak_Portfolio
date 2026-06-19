import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    proficiency: { type: Number, default: 80, min: 0, max: 100 },
    order: { type: Number, default: 0 },
});

const skillModel = mongoose.models.skill || mongoose.model("skill", skillSchema);

export default skillModel;
