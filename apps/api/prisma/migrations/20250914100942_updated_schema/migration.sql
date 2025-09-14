/*
  Warnings:

  - You are about to drop the column `comment` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `dayType` on the `pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `timeWindow` on the `pricing_rules` table. All the data in the column will be lost.
  - Added the required column `total_price` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `pricing_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekday_price` to the `pricing_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekend_price` to the `pricing_rules` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "pc_id" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "total_price" INTEGER NOT NULL,
    "additional_joysticks" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_pc_id_fkey" FOREIGN KEY ("pc_id") REFERENCES "pcs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("created_at", "end_time", "id", "pc_id", "start_time", "status", "updated_at", "user_id") SELECT "created_at", "end_time", "id", "pc_id", "start_time", "status", "updated_at", "user_id" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE TABLE "new_pricing_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "zone_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'HOURLY',
    "name" TEXT NOT NULL,
    "weekday_price" INTEGER NOT NULL,
    "weekend_price" INTEGER NOT NULL,
    "duration_hours" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pricing_rules_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_pricing_rules" ("active", "created_at", "id", "type", "updated_at", "zone_id") SELECT "active", "created_at", "id", "type", "updated_at", "zone_id" FROM "pricing_rules";
DROP TABLE "pricing_rules";
ALTER TABLE "new_pricing_rules" RENAME TO "pricing_rules";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
