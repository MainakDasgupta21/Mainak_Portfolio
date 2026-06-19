import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    github: { type: String, default: "" },
    demo: { type: String, default: "" },
    image: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    date: { type: Number, default: () => Date.now() },
});

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);

export default projectModel;
