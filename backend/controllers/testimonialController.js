import testimonialModel from "../models/testimonialModel.js"
import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js"

async function uploadImage(req) {
    const file = req.files?.image?.[0] || req.file;
    if (!file) return null;
    const result = await uploadBufferToCloudinary(file, { resource_type: "image" });
    return result.secure_url;
}

const addTestimonial = async (req, res) => {
    try {
        const { name, role, company, quote, rating, order } = req.body;
        if (!name || !quote) {
            return res.json({ success: false, message: "name and quote are required" });
        }

        const imageUrl = await uploadImage(req);

        const t = new testimonialModel({
            name,
            role: role || "",
            company: company || "",
            quote,
            rating: Math.min(5, Math.max(1, Number(rating) || 5)),
            order: Number(order) || 0,
            image: imageUrl || "",
        });
        await t.save();
        res.json({ success: true, message: "Testimonial Added", testimonial: t });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateTestimonial = async (req, res) => {
    try {
        const { id, name, role, company, quote, rating, order } = req.body;
        if (!id) return res.json({ success: false, message: "id is required" });

        const patch = {
            ...(name !== undefined && { name }),
            ...(role !== undefined && { role }),
            ...(company !== undefined && { company }),
            ...(quote !== undefined && { quote }),
            ...(rating !== undefined && { rating: Math.min(5, Math.max(1, Number(rating) || 5)) }),
            ...(order !== undefined && { order: Number(order) || 0 }),
        };

        const newImage = await uploadImage(req);
        if (newImage) patch.image = newImage;

        const testimonial = await testimonialModel.findByIdAndUpdate(id, patch, { new: true });
        res.json({ success: true, message: "Testimonial Updated", testimonial });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listTestimonials = async (req, res) => {
    try {
        const testimonials = await testimonialModel.find({}).sort({ order: 1, _id: 1 });
        res.json({ success: true, testimonials });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeTestimonial = async (req, res) => {
    try {
        await testimonialModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Testimonial Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addTestimonial, updateTestimonial, listTestimonials, removeTestimonial };
