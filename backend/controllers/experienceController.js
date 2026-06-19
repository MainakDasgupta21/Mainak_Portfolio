import experienceModel from "../models/experienceModel.js"
import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js"

function parseListField(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value !== "string") return [];
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
        try { return JSON.parse(trimmed).filter(Boolean); } catch { /* fall through */ }
    }
    return trimmed.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
}

async function uploadLogo(req) {
    const file = req.files?.logo?.[0] || req.file;
    if (!file) return null;
    const result = await uploadBufferToCloudinary(file, { resource_type: "image" });
    return result.secure_url;
}

const addExperience = async (req, res) => {
    try {
        const { company, role, period, link, certificate, highlights, order } = req.body;
        const logoUrl = await uploadLogo(req);

        const data = {
            company,
            role,
            period: period || "",
            link: link || "",
            certificate: certificate || "",
            logo: logoUrl || "",
            highlights: parseListField(highlights),
            order: Number(order) || 0,
        };

        const exp = new experienceModel(data);
        await exp.save();
        res.json({ success: true, message: "Experience Added", experience: exp });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateExperience = async (req, res) => {
    try {
        const { id, company, role, period, link, certificate, highlights, order } = req.body;
        if (!id) return res.json({ success: false, message: "id is required" });

        const patch = {
            ...(company !== undefined && { company }),
            ...(role !== undefined && { role }),
            ...(period !== undefined && { period }),
            ...(link !== undefined && { link }),
            ...(certificate !== undefined && { certificate }),
            ...(highlights !== undefined && { highlights: parseListField(highlights) }),
            ...(order !== undefined && { order: Number(order) || 0 }),
        };
        const newLogo = await uploadLogo(req);
        if (newLogo) patch.logo = newLogo;

        const experience = await experienceModel.findByIdAndUpdate(id, patch, { new: true });
        res.json({ success: true, message: "Experience Updated", experience });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listExperience = async (req, res) => {
    try {
        const experience = await experienceModel.find({}).sort({ order: 1, _id: -1 });
        res.json({ success: true, experience });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeExperience = async (req, res) => {
    try {
        await experienceModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Experience Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addExperience, updateExperience, listExperience, removeExperience };
