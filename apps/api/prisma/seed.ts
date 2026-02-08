import 'dotenv/config';
import { prisma } from '../lib/prisma';

// Metrics aligned with what a Factorial Growth team would track: funnel, revenue, engagement.
const FAKE_DEFINITIONS = [
  { name: 'Signups', description: 'New account signups (daily)', measure: 'count' },
  { name: 'Trial starts', description: 'Trials started', measure: 'count' },
  { name: 'Activation rate', description: 'Users who reached first value milestone', measure: '%' },
  { name: 'Trial-to-paid conversion', description: 'Trials that converted to paid', measure: '%' },
  { name: 'MRR', description: 'Monthly recurring revenue', measure: 'k€' },
  { name: 'Logo churn rate', description: 'Customers churned (monthly)', measure: '%' },
  { name: 'DAU', description: 'Daily active users', measure: 'count' },
  { name: 'Onboarding completion rate', description: 'Users who completed onboarding', measure: '%' },
];

function randomIn(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

async function main() {
  console.log('Seeding fake metrics...');

  const now = new Date();
  const thirtyDaysAgo = addDays(now, -30);

  for (const def of FAKE_DEFINITIONS) {
    const existing = await prisma.metricDefinition.findUnique({ where: { name: def.name } });
    if (existing) {
      console.log(`  Skipping "${def.name}" (already exists).`);
      continue;
    }

    const metric = await prisma.metricDefinition.create({
      data: {
        name: def.name,
        description: def.description ?? null,
        measure: def.measure ?? null,
      },
    });

    const valueCount = 80 + Math.floor(randomIn(0, 120));
    const values: { metricId: string; value: number; timestamp: Date }[] = [];

    for (let i = 0; i < valueCount; i++) {
      const t = new Date(
        thirtyDaysAgo.getTime() + (now.getTime() - thirtyDaysAgo.getTime()) * (i / valueCount)
      );
      let value: number;
      switch (def.name) {
        case 'Signups':
          value = Math.floor(randomIn(40, 280));
          break;
        case 'Trial starts':
          value = Math.floor(randomIn(20, 150));
          break;
        case 'Activation rate':
          value = randomIn(18, 42);
          break;
        case 'Trial-to-paid conversion':
          value = randomIn(4, 14);
          break;
        case 'MRR':
          value = randomIn(120, 380);
          break;
        case 'Logo churn rate':
          value = randomIn(1.5, 5);
          break;
        case 'DAU':
          value = Math.floor(randomIn(800, 3500));
          break;
        case 'Onboarding completion rate':
          value = randomIn(55, 85);
          break;
        default:
          value = randomIn(0, 100);
      }
      values.push({ metricId: metric.id, value, timestamp: t });
    }

    await prisma.metricValue.createMany({ data: values });
    console.log(`  Created "${def.name}" with ${valueCount} values.`);
  }

  console.log('Seed done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
