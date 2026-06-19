import achievementModel from "../models/achievementModel.js"

const VALID_ICONS = new Set(["trophy", "award", "medal"]);

const addAchievement = async (req, res) => {
    try {
        const { title, description, icon, order } = req.body;
        if (!title) return res.json({ success: false, message: "title is required" });

        const safeIcon = VALID_ICONS.has(icon) ? icon : "trophy";

        const achievement = new achievementModel({
            title,
            description: description || "",
            icon: safeIcon,
            order: Number(order) || 0,
        });
        await achievement.save();
        res.json({ success: true, message: "Achievement Added", achievement });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateAchievement = async (req, res) => {
    try {
        const { id, title, description, icon, order } = req.body;
        if (!id) return res.json({ success: false, message: "id is required" });

        const patch = {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(icon !== undefined && { icon: VALID_ICONS.has(icon) ? icon : "trophy" }),
            ...(order !== undefined && { order: Number(order) || 0 }),
        };

        const achievement = await achievementModel.findByIdAndUpdate(id, patch, { new: true });
        res.json({ success: true, message: "Achievement Updated", achievement });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listAchievements = async (req, res) => {
    try {
        const achievements = await achievementModel.find({}).sort({ order: 1, _id: 1 });
        res.json({ success: true, achievements });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeAchievement = async (req, res) => {
    try {
        await achievementModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Achievement Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addAchievement, updateAchievement, listAchievements, removeAchievement };
