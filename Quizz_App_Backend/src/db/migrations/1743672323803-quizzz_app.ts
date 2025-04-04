import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizzzApp1743672323803 implements MigrationInterface {
    name = 'QuizzzApp1743672323803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Questions" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "options" text NOT NULL, "correctAnswer" integer NOT NULL, "examId" integer NOT NULL, CONSTRAINT "PK_8f81bcc6305787ab7dd0d828e21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Exams" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "duration" integer NOT NULL, "creatorId" integer NOT NULL, CONSTRAINT "PK_c22084317f28776707eb2be26e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scores" ("id" SERIAL NOT NULL, "exam_id" integer NOT NULL, "user_id" integer NOT NULL, "percentage" double precision NOT NULL, "answers" text NOT NULL, "submit_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "role" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Questions" ADD CONSTRAINT "FK_91b245e82a0242438d74424e0ee" FOREIGN KEY ("examId") REFERENCES "Exams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Exams" ADD CONSTRAINT "FK_d7fc78db4d3709b768a3f2af147" FOREIGN KEY ("creatorId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_bb9bfdb94cd72b0dac425de6be6" FOREIGN KEY ("exam_id") REFERENCES "Exams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_683c8208c44184cae37649140c0" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_683c8208c44184cae37649140c0"`);
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_bb9bfdb94cd72b0dac425de6be6"`);
        await queryRunner.query(`ALTER TABLE "Exams" DROP CONSTRAINT "FK_d7fc78db4d3709b768a3f2af147"`);
        await queryRunner.query(`ALTER TABLE "Questions" DROP CONSTRAINT "FK_91b245e82a0242438d74424e0ee"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "scores"`);
        await queryRunner.query(`DROP TABLE "Exams"`);
        await queryRunner.query(`DROP TABLE "Questions"`);
    }

}
