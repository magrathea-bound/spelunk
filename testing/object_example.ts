export const systemState: any = {
  metadata: {
    version: "1.4.2",
    environment: "production",
    generatedAt: "2026-01-10T12:00:00Z",
    p: { time: "12:00:00", place: "right here right now" },
  },
  organization: {
    id: "org_48291",
    name: "Acme Manufacturing",
    locations: {
      headquarters: {
        address: {
          street: "123 Industrial Way",
          city: "Milwaukee",
          state: "WI",
          postalCode: "53202",
          country: "US",
        },
        contacts: { phone: "+1-414-555-0199", email: "info@acme.example" },
      },
      warehouses: [
        {
          id: "wh_01",
          address: { city: "Madison", state: "WI" },
          capacity: { totalSqFt: 120000, utilizedSqFt: 84500 },
          inventory: {
            categories: {
              rawMaterials: {
                steel: { sku: "STL-001", quantity: 3200, unit: "kg" },
                aluminum: { sku: "ALU-014", quantity: 1800, unit: "kg" },
              },
              finishedGoods: {
                widgets: {
                  standard: { sku: "WID-STD", quantity: 450 },
                  deluxe: { sku: "WID-DLX", quantity: 120 },
                },
              },
            },
          },
        },
      ],
    },
  },
  operations: {
    productionLines: {
      lineA: {
        status: "running",
        metrics: {
          throughputPerHour: 240,
          defectRate: 0.012,
          lastMaintenance: {
            date: "2025-12-15",
            technician: { id: "tech_77", name: "Jordan Lee" },
          },
        },
      },
      lineB: {
        status: "idle",
        metrics: { throughputPerHour: 0, defectRate: null },
      },
    },
    schedules: {
      shifts: {
        day: {
          start: "06:00",
          end: "14:00",
          supervisor: { id: "emp_12", name: "Maria Sanchez" },
        },
        night: {
          start: "22:00",
          end: "06:00",
          supervisor: { id: "emp_34", name: "Ethan Wong" },
        },
      },
    },
  },
  analytics: {
    kpis: {
      monthly: {
        revenue: { current: 1250000, target: 1400000 },
        downtimeHours: { current: 18, target: 10 },
      },
    },
    trends: {
      production: {
        last30Days: [230, 240, 235, 250, 245],
        forecast: { next7Days: { expectedAverage: 248, confidence: 0.87 } },
      },
    },
  },
  nestedArrayTesting: [
    {
      current: [
        { current: [10, 12, 13, 24], target: 10 },
        { current: 18, target: 10 },
      ],
      target: 10,
    },
    { current: 18, target: 10 },
  ],
};
