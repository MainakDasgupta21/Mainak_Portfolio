import educationModel from "../models/educationModel.js"

const addEducation = async (req, res) => {
    try {
        const { degree, field, institution, year, grade, status, order } = req.body;
        if (!degree || !institution) {
            return res.json({ success: false, message: "degree and institution are required" });
        }

        const item = new educationModel({
            degree,
            field: field || "",
            institution,
            year: year || "",
            grade: grade || "",
            status: status === "Pursuing" ? "Pursuing" : "Completed",
            order: Number(order) || 0,
        });
        await item.save();
        res.json({ success: true, message: "Education Added", education: item });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateEducation = async (req, res) => {
    try {
        const { id, degree, field, institution, year, grade, status, order } = req.body;
        if (!id) return res.json({ success: false, message: "id is required" });

        const patch = {
            ...(degree !== undefined && { degree }),
            ...(field !== undefined && { field }),
            ...(institution !== undefined && { institution }),
            ...(year !== undefined && { year }),
            ...(grade !== undefined && { grade }),
            ...(status !== undefined && { status: status === "Pursuing" ? "Pursuing" : "Completed" }),
            ...(order !== undefined && { order: Number(order) || 0 }),
        };

        const education = await educationModel.findByIdAndUpdate(id, patch, { new: true });
        res.json({ success: true, message: "Education Updated", education });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listEducation = async (req, res) => {
    try {
        const education = await educationModel.find({}).sort({ order: 1, _id: 1 });
        res.json({ success: true, education });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeEducation = async (req, res) => {
    try {
        await educationModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Education Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addEducation, updateEducation, listEducation, removeEducation };
