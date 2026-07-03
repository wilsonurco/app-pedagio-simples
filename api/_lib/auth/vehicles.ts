import { getDb } from './db';
import { mapDatabaseConflict } from './errors';

export type StoredVehicle = {
  id: string;
  userId: string;
  plate: string;
  model: string;
  createdAt: string;
};

type VehicleRow = {
  id: string;
  user_id: string;
  plate: string;
  model: string;
  created_at: string;
};

function normalizePlate(plate: string): string {
  return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function toStoredVehicle(row: VehicleRow): StoredVehicle {
  return {
    id: row.id,
    userId: row.user_id,
    plate: row.plate,
    model: row.model,
    createdAt: row.created_at,
  };
}

export function toPublicVehicle(vehicle: StoredVehicle) {
  return {
    plate: vehicle.plate,
    model: vehicle.model,
  };
}

export async function findVehiclesByUserId(userId: string): Promise<StoredVehicle[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM vehicles
    WHERE user_id = ${userId}
    ORDER BY created_at ASC
  `) as VehicleRow[];

  return rows.map(toStoredVehicle);
}

export async function createVehicle(
  userId: string,
  input: { plate: string; model: string },
): Promise<StoredVehicle> {
  const sql = getDb();
  const plate = normalizePlate(input.plate);
  const model = input.model.trim();
  const id = `veh_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  try {
    const rows = (await sql`
      INSERT INTO vehicles (id, user_id, plate, model)
      VALUES (${id}, ${userId}, ${plate}, ${model})
      RETURNING *
    `) as VehicleRow[];

    return toStoredVehicle(rows[0]);
  } catch (error) {
    const conflict = mapDatabaseConflict(error);
    if (conflict) throw conflict;
    throw error;
  }
}

export async function deleteVehicle(userId: string, plate: string): Promise<boolean> {
  const sql = getDb();
  const normalized = normalizePlate(plate);
  const rows = (await sql`
    DELETE FROM vehicles
    WHERE user_id = ${userId} AND plate = ${normalized}
    RETURNING id
  `) as { id: string }[];

  return rows.length > 0;
}

export async function userOwnsPlate(userId: string, plate: string): Promise<boolean> {
  const sql = getDb();
  const normalized = normalizePlate(plate);
  const rows = (await sql`
    SELECT id FROM vehicles
    WHERE user_id = ${userId} AND plate = ${normalized}
    LIMIT 1
  `) as { id: string }[];

  return rows.length > 0;
}
