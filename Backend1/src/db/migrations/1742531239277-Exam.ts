import { MigrationInterface, QueryRunner } from "typeorm";

export class Exam1742531239277 implements MigrationInterface {
    name = 'Exam1742531239277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exam" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "examTitle" character varying(255) NOT NULL, "examDescription" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdById" uuid, CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "FK_a9c3522d6e92161b96929eb697b" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "FK_a9c3522d6e92161b96929eb697b"`);
        await queryRunner.query(`DROP TABLE "exam"`);
    }

}
