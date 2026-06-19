import validator from "validator";
import contactModel from "../models/contactModel.js"

// Public — anyone visiting the portfolio can POST a contact submission.
// Like Forever's open endpoints, we accept the open shape but lightly
// validate the fields to avoid garbage rows.
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.json({ success: false, message: "name, email and message are required" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const doc = new contactModel({
            name: String(name).slice(0, 200),
            email: String(email).slice(0, 200),
            subject: String(subject || "").slice(0, 200),
            message: String(message).slice(0, 4000),
            date: Date.now(),
            status: "new",
        });
        await doc.save();

        res.json({ success: true, message: "Message received. Thank you!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find({}).sort({ date: -1 });
        res.json({ success: true, contacts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeContact = async (req, res) => {
    try {
        await contactModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Message Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const markContactRead = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id) return res.json({ success: false, message: "id is required" });
        const contact = await contactModel.findByIdAndUpdate(
            id,
            { status: status === "new" ? "new" : "read" },
            { new: true }
        );
        res.json({ success: true, contact });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { submitContact, listContacts, removeContact, markContactRead };
