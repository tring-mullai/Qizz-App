import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatedtable1742812742723 implements MigrationInterface {
    name = 'Updatedtable1742812742723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answer" character varying NOT NULL, "userId" integer, "questionId" uuid, "examId" uuid, CONSTRAINT "PK_37b32f666e59572775b1b020fb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "correctAnswer" character varying NOT NULL, "examId" uuid, "createdById" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "examTitle"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "examDescription"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'student'`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "createdById" integer`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_answer" ADD CONSTRAINT "FK_4333f41c4fc441ddb4ba0cc9f2d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answer" ADD CONSTRAINT "FK_39bb21c637a8c11e2f3abd527e6" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answer" ADD CONSTRAINT "FK_b6f0b3424492b461bff1e9dd3cd" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "FK_a9c3522d6e92161b96929eb697b" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_187915d8eaa010cde8b053b35d5" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_187915d8eaa010cde8b053b35d5"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "FK_a9c3522d6e92161b96929eb697b"`);
        await queryRunner.query(`ALTER TABLE "user_answer" DROP CONSTRAINT "FK_b6f0b3424492b461bff1e9dd3cd"`);
        await queryRunner.query(`ALTER TABLE "user_answer" DROP CONSTRAINT "FK_39bb21c637a8c11e2f3abd527e6"`);
        await queryRunner.query(`ALTER TABLE "user_answer" DROP CONSTRAINT "FK_4333f41c4fc441ddb4ba0cc9f2d"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "examDescription" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ADD "examTitle" character varying(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "user_answer"`);
    }

}
