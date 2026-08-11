/*
  Warnings:

  - A unique constraint covering the columns `[VEHICLENO]` on the table `vechilekm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `vechilekm_VEHICLENO_key` ON `vechilekm`(`VEHICLENO`);
