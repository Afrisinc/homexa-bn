import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkCategories() {
  console.log('\n=== Checking all categories ===\n');

  const allCategories = await prisma.category.findMany({
    orderBy: { createdAt: 'asc' },
  });

  console.log('Total categories in DB:', allCategories.length);
  console.log('\nCategories:');
  allCategories.forEach(cat => {
    console.log(`- ${cat.name} (ID: ${cat.id.substring(0, 8)}...)`);
    console.log(`  Parent: ${cat.parentId ? cat.parentId.substring(0, 8) + '...' : 'null'}`);
    console.log(`  Deleted: ${cat.deletedAt ? 'YES (' + cat.deletedAt + ')' : 'NO'}`);
    console.log('');
  });

  const nonDeleted = await prisma.category.findMany({
    where: { deletedAt: null },
  });

  console.log('\nNon-deleted categories:', nonDeleted.length);
  console.log('Names:', nonDeleted.map(c => c.name).join(', '));

  await prisma.$disconnect();
}

checkCategories().catch(err => {
  console.error('Error:', err);
  prisma.$disconnect();
  process.exit(1);
});
