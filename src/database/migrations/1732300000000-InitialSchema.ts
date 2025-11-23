import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1732300000000 implements MigrationInterface {
  name = 'InitialSchema1732300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 2. Criar Tabela USERS
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "refresh_token" character varying,
        "role" character varying(50) NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // 3. Criar Tabela APIARIES
    await queryRunner.query(`
      CREATE TABLE "apiaries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e5264071d56b0416697b726399e" PRIMARY KEY ("id")
      )
    `);

    // 4. Criar Tabela USER_APIARIES (Tabela de Junção)
    await queryRunner.query(`
      CREATE TABLE "user_apiaries" (
        "user_id" uuid NOT NULL,
        "apiary_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_apiaries" PRIMARY KEY ("user_id", "apiary_id")
      )
    `);

    // 5. Criar Tabela HIVES
    await queryRunner.query(`
      CREATE TABLE "hives" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "apiary_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "status" character varying(50) NOT NULL DEFAULT 'ACTIVE',
        "last_read" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_11c3825675c9661e725c051cc5e" PRIMARY KEY ("id")
      )
    `);

    // 6. Criar Tabela SENSOR_READINGS (Será Hipertabela)
    await queryRunner.query(`
      CREATE TABLE "sensor_readings" (
        "hive_id" uuid NOT NULL,
        "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
        "weight" double precision,
        "internal_temperature" double precision,
        "internal_humidity" double precision,
        "external_temperature" double precision,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sensor_readings" PRIMARY KEY ("hive_id", "timestamp")
      )
    `);

    // *** CONVERSÃO PARA HIPERTABELA DO TIMESCALEDB ***
    await queryRunner.query(`
      SELECT create_hypertable('sensor_readings', 'timestamp', if_not_exists => TRUE);
    `);

    // 7. Criar Tabela MANAGEMENT
    await queryRunner.query(`
      CREATE TABLE "management" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "hive_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "type" character varying(100) NOT NULL DEFAULT 'OTHER',
        "notes" text,
        "date" date NOT NULL DEFAULT CURRENT_DATE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_b99329d73072251124328717699" PRIMARY KEY ("id")
      )
    `);

    // 8. Criar Tabela HARVESTS
    await queryRunner.query(`
      CREATE TABLE "harvests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "apiary_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "date" date NOT NULL DEFAULT CURRENT_DATE,
        "honey_weight" numeric(10,2),
        "wax_weight" numeric(10,2),
        "notes" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_harvests" PRIMARY KEY ("id")
      )
    `);

    // 9. Criar Tabela ALERTS
    await queryRunner.query(`
      CREATE TABLE "alerts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "hive_id" uuid NOT NULL,
        "type" character varying(100) NOT NULL,
        "severity" character varying(100) NOT NULL,
        "message" text NOT NULL,
        "status" character varying(100) NOT NULL DEFAULT 'NEW',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_alerts" PRIMARY KEY ("id")
      )
    `);

    // --- FOREIGN KEYS (Chaves Estrangeiras) ---

    // user_apiaries -> users
    await queryRunner.query(`
      ALTER TABLE "user_apiaries" ADD CONSTRAINT "FK_user_apiaries_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    // user_apiaries -> apiaries
    await queryRunner.query(`
      ALTER TABLE "user_apiaries" ADD CONSTRAINT "FK_user_apiaries_apiary" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // hives -> apiaries
    await queryRunner.query(`
      ALTER TABLE "hives" ADD CONSTRAINT "FK_hives_apiary" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // sensor_readings -> hives
    await queryRunner.query(`
      ALTER TABLE "sensor_readings" ADD CONSTRAINT "FK_sensor_readings_hive" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // management -> hives
    await queryRunner.query(`
      ALTER TABLE "management" ADD CONSTRAINT "FK_management_hive" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    // management -> users
    await queryRunner.query(`
      ALTER TABLE "management" ADD CONSTRAINT "FK_management_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // harvests -> apiaries
    await queryRunner.query(`
      ALTER TABLE "harvests" ADD CONSTRAINT "FK_harvests_apiary" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    // harvests -> users
    await queryRunner.query(`
      ALTER TABLE "harvests" ADD CONSTRAINT "FK_harvests_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // alerts -> hives
    await queryRunner.query(`
      ALTER TABLE "alerts" ADD CONSTRAINT "FK_alerts_hive" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Ordem reversa para remover tabelas (evita erro de FK)

    await queryRunner.query(
      `ALTER TABLE "alerts" DROP CONSTRAINT "FK_alerts_hive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "harvests" DROP CONSTRAINT "FK_harvests_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "harvests" DROP CONSTRAINT "FK_harvests_apiary"`,
    );
    await queryRunner.query(
      `ALTER TABLE "management" DROP CONSTRAINT "FK_management_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "management" DROP CONSTRAINT "FK_management_hive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensor_readings" DROP CONSTRAINT "FK_sensor_readings_hive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hives" DROP CONSTRAINT "FK_hives_apiary"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_apiaries" DROP CONSTRAINT "FK_user_apiaries_apiary"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_apiaries" DROP CONSTRAINT "FK_user_apiaries_user"`,
    );

    await queryRunner.query(`DROP TABLE "alerts"`);
    await queryRunner.query(`DROP TABLE "harvests"`);
    await queryRunner.query(`DROP TABLE "management"`);
    await queryRunner.query(`DROP TABLE "sensor_readings"`);
    await queryRunner.query(`DROP TABLE "hives"`);
    await queryRunner.query(`DROP TABLE "user_apiaries"`);
    await queryRunner.query(`DROP TABLE "apiaries"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
