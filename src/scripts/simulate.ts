import { PrismaClient, ChangeType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const DATASET_NAME = 'demo_transactions';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log(`Starting simulation for dataset: ${DATASET_NAME}...`);

  // 1. Cleanup existing demo data
  const existingDataset = await prisma.dataset.findFirst({
    where: { name: DATASET_NAME }
  });

  if (existingDataset) {
    console.log('Cleaning up existing demo dataset...');
    await prisma.dataset.delete({ where: { id: existingDataset.id } });
  }

  // 2. Create Dataset
  const dataset = await prisma.dataset.create({
    data: {
      name: DATASET_NAME,
      description: 'Demo transactions table used for simulating metadata changes.'
    }
  });

  // Base configurations
  let currentSchema = { database: 'finance', schema: 'public' };
  let currentLineage = { upstream: ['pos_system_a'], downstream: ['financial_dashboard'] };
  let currentColumns = [
    { name: 'id', type: 'UUID', description: 'Primary Key' },
    { name: 'amount', type: 'DECIMAL', description: 'Transaction amount' },
    { name: 'user_id', type: 'UUID', description: 'User making the transaction' }
  ];

  // Helper to create snapshot
  const createSimSnapshot = async () => {
    return await prisma.metadataSnapshot.create({
      data: {
        datasetId: dataset.id,
        schema: currentSchema,
        lineage: currentLineage,
        columns: currentColumns
      }
    });
  };

  // Helper to create event
  const createEvent = async (snapshotId: string, type: ChangeType, desc: string, diff: any) => {
    await prisma.metadataChangeEvent.create({
      data: {
        datasetId: dataset.id,
        snapshotId,
        changeType: type,
        description: desc,
        diff
      }
    });
  };

  // --- STEP 1: Initial Dataset ---
  console.log('Step 1: Initializing base dataset...');
  const snap1 = await createSimSnapshot();
  await sleep(1000);

  // --- STEP 2: Add Column ---
  console.log('Step 2: Simulating COLUMN_ADDED...');
  const newCol = { name: 'currency', type: 'VARCHAR', description: 'Transaction currency code' };
  currentColumns = [...currentColumns, newCol];
  const snap2 = await createSimSnapshot();
  await createEvent(snap2.id, ChangeType.COLUMN_ADDED, 'Column added: currency', { new: newCol });
  await sleep(1000);

  // --- STEP 3: Change Schema ---
  console.log('Step 3: Simulating SCHEMA_CHANGE...');
  const oldSchema = { ...currentSchema };
  currentSchema = { database: 'finance_v2', schema: 'public' };
  const snap3 = await createSimSnapshot();
  await createEvent(snap3.id, ChangeType.SCHEMA_CHANGE, 'Database schema configuration changed', { old: oldSchema, new: currentSchema });
  await sleep(1000);

  // --- STEP 4: Change Lineage ---
  console.log('Step 4: Simulating LINEAGE_CHANGE...');
  const oldLineage = { ...currentLineage };
  currentLineage = { upstream: ['pos_system_a', 'stripe_gateway'], downstream: ['financial_dashboard'] };
  const snap4 = await createSimSnapshot();
  await createEvent(snap4.id, ChangeType.LINEAGE_CHANGE, 'Dataset lineage changed', { old: oldLineage, new: currentLineage });
  await sleep(1000);

  // --- STEP 5: Remove Column (High Severity) ---
  console.log('Step 5: Simulating COLUMN_REMOVED...');
  const removedCol = currentColumns.find(c => c.name === 'user_id');
  currentColumns = currentColumns.filter(c => c.name !== 'user_id');
  const snap5 = await createSimSnapshot();
  await createEvent(snap5.id, ChangeType.COLUMN_REMOVED, 'Column removed: user_id', { old: removedCol });

  console.log('\nSimulation complete! ✅');
  console.log(`Dataset ID to use in Frontend: ${dataset.id}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
