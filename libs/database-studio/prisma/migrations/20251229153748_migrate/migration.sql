/*
  Warnings:

  - You are about to drop the `agent_interaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agent_learning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `agent_outcome` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "lssm_sigil"."agent_outcome" DROP CONSTRAINT "agent_outcome_interactionId_fkey";

-- DropTable
DROP TABLE "lssm_sigil"."agent_interaction";

-- DropTable
DROP TABLE "lssm_sigil"."agent_learning";

-- DropTable
DROP TABLE "lssm_sigil"."agent_outcome";

-- DropEnum
DROP TYPE "lssm_sigil"."AgentLearningCategory";

-- DropEnum
DROP TYPE "lssm_sigil"."AgentLearningScope";

-- DropEnum
DROP TYPE "lssm_sigil"."AgentOutcomeSignal";

-- DropEnum
DROP TYPE "lssm_sigil"."AgentOutcomeType";
