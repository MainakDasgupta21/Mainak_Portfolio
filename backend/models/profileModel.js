import mongoose from "mongoose";

// Singleton document. We always read/write the doc with _id === "profile"
// so the public site has exactly one source of truth for the hero / bio /
// contact / branding / social links.
const profileSchema = new mongoose.Schema({
    _id: { type: String, default: "profile" },

    name: { type: String, default: "" },
    title: { type: String, default: "" },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },

    brandShortName: { type: String, default: "" },
    brandMonogram: { type: String, default: "" },

    heroUi: {
        badge: { type: String, default: "Crafting Unique Solutions" },
        introPrefix: { type: String, default: "Hi, I'm" },
        role: { type: String, default: "" },
        primaryCtaLabel: { type: String, default: "Book a Free Call" },
        primaryCtaHref: { type: String, default: "#contact" },
        secondaryCtaLabel: { type: String, default: "See Projects" },
        secondaryCtaHref: { type: String, default: "#projects" },
        scrollHintTop: { type: String, default: "Scroll down" },
        scrollHintBottom: { type: String, default: "to see projects" },
    },

    media: {
        heroVideoSrc: { type: String, default: "/back.mp4" },
        heroPosterSrc: { type: String, default: "/back-poster.jpg" },
        heroProfileSrc: { type: String, default: "/me.png" },
        aboutProfileSrc: { type: String, default: "/my-picture-informal-1.jpg" },
        resumePdf: { type: String, default: "" },
    },

    links: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        leetcode: { type: String, default: "" },
        codeforces: { type: String, default: "" },
        geekforgeeks: { type: String, default: "" },
        twitter: { type: String, default: "" },
    },

    sectionSubtitles: {
        about: { type: String, default: "" },
        projects: { type: String, default: "Transforming ideas into elegant solutions" },
        experience: { type: String, default: "Professional journey building impactful solutions" },
        skills: { type: String, default: "Technical expertise across multiple domains" },
        achievements: { type: String, default: "Recognition and milestones that define excellence" },
        testimonials: { type: String, default: "What colleagues and mentors say" },
        contact: { type: String, default: "Let's discuss your next project" },
    },

    coursework: { type: [String], default: [] },
}, { _id: false });

const profileModel = mongoose.models.profile || mongoose.model("profile", profileSchema);

export default profileModel;
