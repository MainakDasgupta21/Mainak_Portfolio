import profileModel from "../models/profileModel.js";

// Public — returns the singleton profile (creates an empty one on first call).
const getProfile = async (req, res) => {
    try {
        let profile = await profileModel.findById("profile");
        if (!profile) {
            profile = await profileModel.create({ _id: "profile" });
        }
        res.json({ success: true, profile });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Admin — upserts every field of the singleton profile.
const updateProfile = async (req, res) => {
    try {
        const payload = req.body || {};
        // Force singleton id.
        payload._id = "profile";

        const profile = await profileModel.findByIdAndUpdate(
            "profile",
            payload,
            { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
        );

        res.json({ success: true, message: "Profile Updated", profile });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getProfile, updateProfile };
