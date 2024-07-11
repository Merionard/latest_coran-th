-- AlterTable
CREATE SEQUENCE hadithchapter_id_seq;
ALTER TABLE "hadithChapter" ALTER COLUMN "id" SET DEFAULT nextval('hadithchapter_id_seq');
ALTER SEQUENCE hadithchapter_id_seq OWNED BY "hadithChapter"."id";
