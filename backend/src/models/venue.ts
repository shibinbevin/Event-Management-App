import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class Venue {
    @PrimaryGeneratedColumn("uuid")
    venue_id!: string;

    @Column({ type: 'text', nullable: false })
    venue_name!: string;

    @Column({ type: 'text', nullable: false })
    country!: string;

    @Column({ type: 'text', nullable: false })
    city!: string;

    @Column({ type: 'int', nullable: false })
    capacity!: number;

    @Column({ type: 'boolean', nullable: false })
    is_available!: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    date?: string;
}
