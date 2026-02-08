import type { MetricDefinitionDto, MetricValueDto } from '../types/metrics';
import type { PrismaClient } from '@prisma/client';

/**
 * Repository interface: data access for metrics (DIP – depend on abstraction).
 */
export interface IMetricsRepository {
  findAllDefinitions(): Promise<MetricDefinitionDto[]>;
  findDefinitionById(id: string): Promise<MetricDefinitionDto | null>;
  findDefinitionByName(name: string): Promise<MetricDefinitionDto | null>;
  findValuesInRange(from: Date, to: Date): Promise<Array<MetricValueDto & { metric: MetricDefinitionDto }>>;
  findDefinitionWithValues(id: string, from: Date, to: Date): Promise<{ metric: MetricDefinitionDto; values: MetricValueDto[] } | null>;
  createDefinition(data: { name: string; description?: string; measure?: string }): Promise<MetricDefinitionDto>;
  createValue(data: { metricId: string; value: number; timestamp?: Date }): Promise<MetricValueDto>;
}

function toDefinitionDto(row: { id: string; name: string; description: string | null; measure: string | null; createdAt: Date }): MetricDefinitionDto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    measure: row.measure,
    createdAt: row.createdAt,
  };
}

function toValueDto(row: { id: string; metricId: string; value: number; timestamp: Date }): MetricValueDto {
  return {
    id: row.id,
    metricId: row.metricId,
    value: row.value,
    timestamp: row.timestamp,
  };
}

/**
 * Prisma implementation of metrics repository (single place for DB access).
 */
export function createMetricsRepository(prisma: PrismaClient): IMetricsRepository {
  return {
    async findAllDefinitions() {
      const list = await prisma.metricDefinition.findMany({ orderBy: { name: 'asc' } });
      return list.map(toDefinitionDto);
    },

    async findDefinitionById(id: string) {
      const row = await prisma.metricDefinition.findUnique({ where: { id } });
      return row ? toDefinitionDto(row) : null;
    },

    async findDefinitionByName(name: string) {
      const row = await prisma.metricDefinition.findUnique({ where: { name } });
      return row ? toDefinitionDto(row) : null;
    },

    async findValuesInRange(from: Date, to: Date) {
      const rows = await prisma.metricValue.findMany({
        where: { timestamp: { gte: from, lte: to } },
        include: { metric: true },
        orderBy: { timestamp: 'asc' },
      });
      return rows.map((v) => ({
        ...toValueDto(v),
        metric: toDefinitionDto(v.metric),
      }));
    },

    async findDefinitionWithValues(id: string, from: Date, to: Date) {
      const definition = await prisma.metricDefinition.findUnique({ where: { id } });
      if (!definition) return null;
      const values = await prisma.metricValue.findMany({
        where: { metricId: id, timestamp: { gte: from, lte: to } },
        orderBy: { timestamp: 'asc' },
      });
      return {
        metric: toDefinitionDto(definition),
        values: values.map(toValueDto),
      };
    },

    async createDefinition(data: { name: string; description?: string; measure?: string }) {
      const row = await prisma.metricDefinition.create({
        data: { name: data.name, description: data.description, measure: data.measure },
      });
      return toDefinitionDto(row);
    },

    async createValue(data: { metricId: string; value: number; timestamp?: Date }) {
      const row = await prisma.metricValue.create({
        data: {
          metricId: data.metricId,
          value: data.value,
          ...(data.timestamp && { timestamp: data.timestamp }),
        },
      });
      return toValueDto(row);
    },
  };
}
