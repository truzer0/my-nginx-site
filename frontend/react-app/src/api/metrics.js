import { collectDefaultMetrics, Registry } from 'prom-client';

// Создаем отдельный реестр для избежания конфликтов
const registry = new Registry();
collectDefaultMetrics({ register: registry });

export default async function handler(req, res) {
  try {
    const metrics = await registry.metrics();
    res.setHeader('Content-Type', registry.contentType);
    res.send(metrics);
  } catch (err) {
    console.error('Error generating metrics:', err);
    res.status(500).end();
  }
}
