import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    period: { type: String, default: "" },
    link: { type: String, default: "" },
    logo: { type: String, default: "" },
    certificate: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
});

const experienceModel = mongoose.models.experience || mongoose.model("experience", experienceSchema);

export default experienceModel;
