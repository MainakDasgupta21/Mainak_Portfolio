import skillModel from "../models/skillModel.js"

const addSkill = async (req, res) => {
    try {
        const { category, name, proficiency, order } = req.body;
        if (!category || !name) {
            return res.json({ success: false, message: "category and name are required" });
        }
        const skill = new skillModel({
            category,
            name,
            proficiency: Number(proficiency) || 80,
            order: Number(order) || 0,
        });
        await skill.save();
        res.json({ success: true, message: "Skill Added", skill });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateSkill = async (req, res) => {
    try {
        const { id, category, name, proficiency, order } = req.body;
        if (!id) return res.json({ success: false, message: "id is required" });

        const patch = {
            ...(category !== undefined && { category }),
            ...(name !== undefined && { name }),
            ...(proficiency !== undefined && { proficiency: Number(proficiency) || 0 }),
            ...(order !== undefined && { order: Number(order) || 0 }),
        };

        const skill = await skillModel.findByIdAndUpdate(id, patch, { new: true });
        res.json({ success: true, message: "Skill Updated", skill });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listSkills = async (req, res) => {
    try {
        const skills = await skillModel.find({}).sort({ category: 1, order: 1, _id: 1 });
        res.json({ success: true, skills });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeSkill = async (req, res) => {
    try {
        await skillModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Skill Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addSkill, updateSkill, listSkills, removeSkill };
