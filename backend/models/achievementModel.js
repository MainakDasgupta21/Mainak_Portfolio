import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "trophy" }, // "trophy" | "award" | "medal"
    order: { type: Number, default: 0 },
});

const achievementModel = mongoose.models.achievement || mongoose.model("achievement", achievementSchema);

export default achievementModel;
