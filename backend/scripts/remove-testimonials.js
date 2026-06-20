import 'dotenv/config'
import mongoose from 'mongoose'

import connectDB from '../config/mongodb.js'

async function dropTestimonialsCollection() {
    const db = mongoose.connection.db
    const hasTestimonials = await db.listCollections({ name: 'testimonials' }).hasNext()

    if (!hasTestimonials) {
        console.log('No testimonials collection found. Skipping drop.')
        return
    }

    await db.collection('testimonials').drop()
    console.log('Dropped testimonials collection.')
}

async function unsetProfileTestimonialSubtitle() {
    const result = await mongoose.connection
        .collection('profiles')
        .updateMany({}, { $unset: { 'sectionSubtitles.testimonials': '' } })

    console.log(`Unset sectionSubtitles.testimonials in ${result.modifiedCount} profile document(s).`)
}

async function main() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set. Aborting cleanup.')
    }

    await connectDB()
    await dropTestimonialsCollection()
    await unsetProfileTestimonialSubtitle()
    console.log('Testimonials cleanup completed.')
}

main()
    .then(async () => {
        await mongoose.connection.close()
    })
    .catch(async (error) => {
        console.error('Testimonials cleanup failed:', error.message)
        await mongoose.connection.close()
        process.exit(1)
    })
