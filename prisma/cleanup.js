const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up database...');

    // Ordered deletion to handle foreign key constraints if not cascaded
    await prisma.review.deleteMany({});
    await prisma.reservation.deleteMany({});
    await prisma.house.deleteMany({});
    // We keep neighborhoods and users as they are part of the core structure

    console.log('Successfully deleted all houses, reviews, and reservations.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
