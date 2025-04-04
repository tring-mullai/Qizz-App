import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizzApp1743742092568 implements MigrationInterface {
    name = 'QuizzApp1743742092568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_bb9bfdb94cd72b0dac425de6be6"`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_bb9bfdb94cd72b0dac425de6be6" FOREIGN KEY ("exam_id") REFERENCES "Exams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_bb9bfdb94cd72b0dac425de6be6"`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_bb9bfdb94cd72b0dac425de6be6" FOREIGN KEY ("exam_id") REFERENCES "Exams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
