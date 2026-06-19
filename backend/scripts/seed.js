// Reads backend/seed-data/resume.json (same shape as the existing
// src/data/resume.json) and populates every Mongo collection so the
// public site is functional immediately after `npm run seed`.
//
// Usage:
//   cd backend
//   npm run seed
//
// Safe to run multiple times — each call wipes the existing collections
// (except `contacts` and `media`) and reseeds from the JSON file.

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

import connectDB from '../config/mongodb.js'

import profileModel from '../models/profileModel.js'
import projectModel from '../models/projectModel.js'
import experienceModel from '../models/experienceModel.js'
import skillModel from '../models/skillModel.js'
import achievementModel from '../models/achievementModel.js'
import testimonialModel from '../models/testimonialModel.js'
import educationModel from '../models/educationModel.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set. Aborting.')
        process.exit(1)
    }

    const dataPath = path.join(__dirname, '..', 'seed-data', 'resume.json')
    if (!fs.existsSync(dataPath)) {
        console.error('Missing seed file:', dataPath)
        process.exit(1)
    }
    const raw = fs.readFileSync(dataPath, 'utf-8')
    const data = JSON.parse(raw)

    await connectDB()
    // Give Mongoose a tick to actually emit the 'connected' event.
    await new Promise((resolve) => setTimeout(resolve, 250))

    console.log('Seeding portfolio collections...')

    // ---- Profile (singleton) ----
    const profilePayload = {
        _id: 'profile',
        name: data.personal?.name || '',
        title: data.personal?.title || '',
        tagline: data.personal?.tagline || '',
        bio: data.personal?.bio || '',
        email: data.personal?.email || '',
        phone: data.personal?.phone || '',
        brandShortName: data.branding?.brandShortName || '',
        brandMonogram: data.branding?.brandMonogram || '',
        heroUi: data.heroUi || {},
        media: data.media || {},
        links: data.links || {},
        sectionSubtitles: data.sectionSubtitles || {},
        coursework: Array.isArray(data.coursework) ? data.coursework : [],
    }
    await profileModel.findByIdAndUpdate('profile', profilePayload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
    })
    console.log('  profile           ✓')

    // ---- Projects ----
    await projectModel.deleteMany({})
    const projectDocs = (data.projects || []).map((p, i) => ({
        name: p.name,
        description: p.description || '',
        technologies: p.technologies || [],
        highlights: p.highlights || [],
        github: p.github || '',
        demo: p.demo || '',
        image: Array.isArray(p.image) ? p.image : (p.image ? [p.image] : []),
        featured: !!p.featured,
        order: typeof p.order === 'number' ? p.order : i,
        date: p.date || Date.now() - i * 1000,
    }))
    if (projectDocs.length) await projectModel.insertMany(projectDocs)
    console.log(`  projects (${projectDocs.length})       ✓`)

    // ---- Experience ----
    await experienceModel.deleteMany({})
    const experienceDocs = (data.experience || []).map((e, i) => ({
        company: e.company,
        role: e.role,
        period: e.period || '',
        link: e.link || '',
        logo: e.logo || '',
        certificate: e.certificate || '',
        highlights: e.highlights || [],
        order: typeof e.order === 'number' ? e.order : i,
    }))
    if (experienceDocs.length) await experienceModel.insertMany(experienceDocs)
    console.log(`  experience (${experienceDocs.length})    ✓`)

    // ---- Skills (flatten category → many docs) ----
    await skillModel.deleteMany({})
    const skillDocs = []
    let skillCounter = 0
    Object.entries(data.skills || {}).forEach(([category, list]) => {
        ;(list || []).forEach((s, idx) => {
            skillDocs.push({
                category,
                name: s.name,
                proficiency: typeof s.proficiency === 'number' ? s.proficiency : 80,
                order: idx + skillCounter,
            })
        })
        skillCounter += 1000
    })
    if (skillDocs.length) await skillModel.insertMany(skillDocs)
    console.log(`  skills (${skillDocs.length})         ✓`)

    // ---- Achievements ----
    await achievementModel.deleteMany({})
    const achievementDocs = (data.achievements || []).map((a, i) => ({
        title: a.title,
        description: a.description || '',
        icon: ['trophy', 'award', 'medal'].includes(a.icon) ? a.icon : 'trophy',
        order: typeof a.order === 'number' ? a.order : i,
    }))
    if (achievementDocs.length) await achievementModel.insertMany(achievementDocs)
    console.log(`  achievements (${achievementDocs.length})  ✓`)

    // ---- Testimonials ----
    await testimonialModel.deleteMany({})
    const testimonialDocs = (data.testimonials || []).map((t, i) => ({
        name: t.name,
        role: t.role || '',
        company: t.company || '',
        image: t.image || '',
        quote: t.quote,
        rating: typeof t.rating === 'number' ? t.rating : 5,
        order: typeof t.order === 'number' ? t.order : i,
    }))
    if (testimonialDocs.length) await testimonialModel.insertMany(testimonialDocs)
    console.log(`  testimonials (${testimonialDocs.length})  ✓`)

    // ---- Education ----
    await educationModel.deleteMany({})
    const educationDocs = (data.education || []).map((e, i) => ({
        degree: e.degree,
        field: e.field || '',
        institution: e.institution,
        year: e.year || '',
        grade: e.grade || '',
        status: e.status === 'Pursuing' ? 'Pursuing' : 'Completed',
        order: typeof e.order === 'number' ? e.order : i,
    }))
    if (educationDocs.length) await educationModel.insertMany(educationDocs)
    console.log(`  education (${educationDocs.length})     ✓`)

    console.log('\nSeed complete.')
    await mongoose.connection.close()
}

main().catch((err) => {
    console.error('Seed failed:', err)
    mongoose.connection.close().finally(() => process.exit(1))
})
