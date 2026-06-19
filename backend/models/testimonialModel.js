import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    image: { type: String, default: "" },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
});

const testimonialModel = mongoose.models.testimonial || mongoose.model("testimonial", testimonialSchema);

export default testimonialModel;
