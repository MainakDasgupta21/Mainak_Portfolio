import projectModel from "../models/projectModel.js"
import uploadBufferToCloudinary from "../utils/cloudinaryUpload.js"

const EXTERNAL_PROTOCOL_RE = /^[a-z][a-z\d+.-]*:\/\//i;
const LOCALHOST_RE = /^localhost(?::\d+)?(?:\/|$)/i;
const IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/|$)/;
const DOMAIN_LIKE_RE = /^(?:[a-z\d-]+\.)+[a-z]{2,}(?::\d+)?(?:\/|$)/i;

const looksLikeExternalHost = (value) =>
    LOCALHOST_RE.test(value) || IPV4_RE.test(value) || DOMAIN_LIKE_RE.test(value);

const normalizeExternalUrl = (value) => {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed) return "";

    let candidate = trimmed;
    if (candidate.startsWith("//")) {
        candidate = `https:${candidate}`;
    } else if (!EXTERNAL_PROTOCOL_RE.test(candidate) && looksLikeExternalHost(candidate)) {
        candidate = `https://${candidate}`;
    }

    try {
        const parsed = new URL(candidate);
        const protocol = parsed.protocol.toLowerCase();
        if (protocol !== "http:" && protocol !== "https:") return "";
        return parsed.toString();
    } catch {
        return "";
    }
};

// Pull up-to-four uploaded files (image1..image4) and upload each to Cloudinary.
// Mirrors Forever's productController.addProduct image handling.
const uploadProjectImages = async (files) => {
    const f = files || {};
    const items = [f.image1?.[0], f.image2?.[0], f.image3?.[0], f.image4?.[0]]
        .filter(Boolean);
    if (!items.length) return [];

    return Promise.all(items.map(async (item) => {
        const result = await uploadBufferToCloudinary(item, { resource_type: "image" });
        return result.secure_url;
    }));
}

const addProject = async (req, res) => {
    try {
        const { name, description, technologies, highlights, github, demo, featured, order } = req.body;
        const normalizedGithub = normalizeExternalUrl(github);
        const normalizedDemo = normalizeExternalUrl(demo);

        if (typeof github === "string" && github.trim() && !normalizedGithub) {
            return res.json({ success: false, message: "Please provide a valid GitHub URL (http/https)." });
        }
        if (typeof demo === "string" && demo.trim() && !normalizedDemo) {
            return res.json({ success: false, message: "Please provide a valid Demo URL (http/https)." });
        }

        const imageUrls = await uploadProjectImages(req.files);

        const data = {
            name,
            description: description || "",
            technologies: parseListField(technologies),
            highlights: parseListField(highlights),
            github: normalizedGithub,
            demo: normalizedDemo,
            featured: featured === "true" || featured === true,
            order: Number(order) || 0,
            image: imageUrls,
            date: Date.now(),
        };

        const project = new projectModel(data);
        await project.save();

        res.json({ success: true, message: "Project Added", project });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateProject = async (req, res) => {
    try {
        const { id, name, description, technologies, highlights, github, demo, featured, order } = req.body;
        if (!id) return res.json({ success: false, message: "id is required" });

        let normalizedGithub;
        if (github !== undefined) {
            normalizedGithub = normalizeExternalUrl(github);
            if (typeof github === "string" && github.trim() && !normalizedGithub) {
                return res.json({ success: false, message: "Please provide a valid GitHub URL (http/https)." });
            }
        }

        let normalizedDemo;
        if (demo !== undefined) {
            normalizedDemo = normalizeExternalUrl(demo);
            if (typeof demo === "string" && demo.trim() && !normalizedDemo) {
                return res.json({ success: false, message: "Please provide a valid Demo URL (http/https)." });
            }
        }

        const patch = {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(technologies !== undefined && { technologies: parseListField(technologies) }),
            ...(highlights !== undefined && { highlights: parseListField(highlights) }),
            ...(github !== undefined && { github: normalizedGithub }),
            ...(demo !== undefined && { demo: normalizedDemo }),
            ...(featured !== undefined && { featured: featured === "true" || featured === true }),
            ...(order !== undefined && { order: Number(order) || 0 }),
        };

        const newImages = await uploadProjectImages(req.files);
        if (newImages.length) patch.image = newImages;

        const project = await projectModel.findByIdAndUpdate(id, patch, { new: true });
        res.json({ success: true, message: "Project Updated", project });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listProjects = async (req, res) => {
    try {
        const projects = await projectModel.find({}).sort({ order: 1, date: -1 });
        res.json({ success: true, projects });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeProject = async (req, res) => {
    try {
        await projectModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Project Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Accepts either a JSON-stringified array (form-data POST) or a real array
// (raw JSON POST). Falls back to a comma-split for convenience.
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

export { addProject, updateProject, listProjects, removeProject };
