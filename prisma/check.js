const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking database...');
    const count = await prisma.house.count();
    console.log(`Total houses: ${count}`);

    const neighborhoods = await prisma.neighborhood.count();
    console.log(`Total neighborhoods: ${neighborhoods}`);

    const houses = await prisma.house.findMany({
        include: { neighborhood: true }
    });
    console.log(JSON.stringify(houses, null, 2));
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
