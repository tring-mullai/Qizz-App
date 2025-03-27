import { MigrationInterface, QueryRunner } from "typeorm";

export class Quizz11742976508088 implements MigrationInterface {
    name = 'Quizz11742976508088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "options" text NOT NULL, "correct_answer" integer NOT NULL, "examId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exam" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "duration" integer NOT NULL, "creatorId" integer, CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "score" ("id" SERIAL NOT NULL, "percentage" double precision NOT NULL, "answers" json NOT NULL, "questions" json NOT NULL, "userId" integer, "examId" integer, CONSTRAINT "PK_1770f42c61451103f5514134078" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exam" ADD CONSTRAINT "FK_d109fdb3a398ed3946c6d23d0b7" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "score" ADD CONSTRAINT "FK_327e5a5890df4462edf4ac9fa30" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "score" ADD CONSTRAINT "FK_58679d6970f77d25164681e82f0" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "score" DROP CONSTRAINT "FK_58679d6970f77d25164681e82f0"`);
        await queryRunner.query(`ALTER TABLE "score" DROP CONSTRAINT "FK_327e5a5890df4462edf4ac9fa30"`);
        await queryRunner.query(`ALTER TABLE "exam" DROP CONSTRAINT "FK_d109fdb3a398ed3946c6d23d0b7"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_286bbf761d3af4e2fcac4a634d5"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "score"`);
        await queryRunner.query(`DROP TABLE "exam"`);
        await queryRunner.query(`DROP TABLE "question"`);
    }

}
