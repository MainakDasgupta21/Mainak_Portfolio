import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    date: { type: Number, default: () => Date.now() },
    status: { type: String, default: "new" }, // "new" | "read"
});

const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema);

export default contactModel;
