const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding fake data...');

    // 1. Get or create a sample vendor
    // Note: This assumes you have at least one user or we create a dummy one
    let vendor = await prisma.user.findFirst({
        where: { role: 'VENDEUR' }
    });

    if (!vendor) {
        vendor = await prisma.user.create({
            data: {
                name: 'Agence Immobilière EADES',
                email: 'contact@eades.tg',
                password: 'password123', // In real app, this would be hashed
                role: 'VENDEUR',
                emailVerified: new Date(),
            }
        });
    }

    // 2. Create sample neighborhoods
    const neighborhoods = ['Adidogomé', 'Agoè', 'Tokoin', 'Bè', 'Amoutivé'];
    const neighborhoodObjects = [];

    for (const name of neighborhoods) {
        const neighborhood = await prisma.neighborhood.upsert({
            where: { name: name.toUpperCase() },
            update: {},
            create: { name: name.toUpperCase() }
        });
        neighborhoodObjects.push(neighborhood);
    }

    // 3. Create fake houses
    const fakeHouses = [
        {
            title: 'Appartement Moderne T3',
            description: 'Superbe appartement de 3 pièces situé au coeur de la ville. Balcons spacieux, cuisine équipée et séjou lumineux.',
            price: 150000,
            location: 'Près du Monument de l\'Indépendance',
            status: 'DISPONIBLE',
            neighborhoodId: neighborhoodObjects[2].id, // Tokoin
            vendorId: vendor.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'])
        },
        {
            title: 'Villa de Luxe avec Piscine',
            description: 'Magnifique villa contemporaine avec jardin arboré et piscine privée. Idéal pour une famille.',
            price: 500000,
            location: 'Zone Résidentielle',
            status: 'DISPONIBLE',
            neighborhoodId: neighborhoodObjects[1].id, // Agoè
            vendorId: vendor.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1613977257363-707ba9348227', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'])
        },
        {
            title: 'Studio Étudiant Pratique',
            description: 'Studio meublé et équipé, proche des commodités et des universités. Très bon état et sécurisé.',
            price: 45000,
            location: 'Face au Marché',
            status: 'DISPONIBLE',
            neighborhoodId: neighborhoodObjects[0].id, // Adidogomé
            vendorId: vendor.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1536376074432-bf121770998a'])
        },
        {
            title: 'Maison Familiale Spacieuse',
            description: 'Belle maison traditionnelle de 4 chambres avec cour intérieure et garage. Proche des écoles.',
            price: 250000,
            location: 'Quartier calme',
            status: 'LOUE',
            neighborhoodId: neighborhoodObjects[3].id, // Bè
            vendorId: vendor.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83'])
        }
    ];

    for (const house of fakeHouses) {
        await prisma.house.create({
            data: house
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
