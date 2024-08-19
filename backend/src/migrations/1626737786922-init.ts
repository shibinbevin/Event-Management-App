import { MigrationInterface, QueryRunner } from "typeorm";

export class init1626737786922 implements MigrationInterface {
    name = 'init1626737786922';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE active_session (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                token TEXT NOT NULL,
                userId TEXT NOT NULL,
                date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE role (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE user (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                username TEXT NOT NULL,
                email TEXT,
                password TEXT,
                user_role VARCHAR(255),
                dob DATE NOT NULL,
                date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_role) REFERENCES role(id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE venue (
                venue_id VARCHAR(255) PRIMARY KEY NOT NULL,
                venue_name TEXT NOT NULL,
                city VARCHAR(255) NOT NULL,
                country VARCHAR(255) NOT NULL,
                capacity INT NOT NULL,
                is_available BOOLEAN NOT NULL,
                date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE category (
                category_id VARCHAR(255) PRIMARY KEY NOT NULL,
                category_name TEXT NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE event (
                event_id VARCHAR(255) PRIMARY KEY NOT NULL,
                event_name TEXT NOT NULL,
                venue VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                organizer_name VARCHAR(255),
                event_date DATE NOT NULL,
                date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (venue) REFERENCES venue(venue_id),
                FOREIGN KEY (category) REFERENCES category(category_id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE ticket (
                ticket_id VARCHAR(255) PRIMARY KEY NOT NULL,
                count INT NOT NULL,
                total_price INT NOT NULL,
                event_id VARCHAR(255),
                user_id VARCHAR(255),
                FOREIGN KEY (event_id) REFERENCES event(event_id),
                FOREIGN KEY (user_id) REFERENCES user(id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE ticket`);
        await queryRunner.query(`DROP TABLE event`);
        await queryRunner.query(`DROP TABLE category`);
        await queryRunner.query(`DROP TABLE venue`);
        await queryRunner.query(`DROP TABLE user`);
        await queryRunner.query(`DROP TABLE role`);
        await queryRunner.query(`DROP TABLE active_session`);
    }
}
