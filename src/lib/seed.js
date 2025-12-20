import { getCollection } from './db';
import { hashPassword } from './auth';

/**
 * Seed the admin user if it doesn't exist
 */
export async function seedAdminUser() {
    try {
        const usersCollection = await getCollection('users');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin1@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'sami123';

        // Check if admin already exists
        const existingAdmin = await usersCollection.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await hashPassword(adminPassword);

            await usersCollection.insertOne({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date(),
            });

            console.log('✅ Admin user seeded successfully');
            return true;
        }

        console.log('ℹ️  Admin user already exists');
        return false;
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        throw error;
    }
}

/**
 * Initialize database collections with indexes
 */
export async function initializeDatabase() {
    try {
        const db = await getCollection('blogs');

        // Create indexes for better query performance
        const blogsCollection = await getCollection('blogs');
        await blogsCollection.createIndex({ slug: 1 }, { unique: true });
        await blogsCollection.createIndex({ category: 1 });
        await blogsCollection.createIndex({ createdAt: -1 });

        const projectsCollection = await getCollection('projects');
        await projectsCollection.createIndex({ slug: 1 }, { unique: true });
        await projectsCollection.createIndex({ category: 1 });

        const servicesCollection = await getCollection('services');
        await servicesCollection.createIndex({ category: 1 });

        const usersCollection = await getCollection('users');
        await usersCollection.createIndex({ email: 1 }, { unique: true });

        console.log('✅ Database indexes created successfully');

        // Seed admin user
        await seedAdminUser();

        return true;
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        // Don't throw - indexes might already exist
        return false;
    }
}
