import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import Venue from '../models/venue';
import Category from '../models/category';

@Entity()
export default class Event {
    @PrimaryGeneratedColumn("uuid")
    event_id!: string;

    @Column({ type: 'text', nullable: false })
    event_name!: string;

    @Column({ type: 'text', nullable: false })
    organizer_name!: string;

    @Column({ type: 'int', nullable: false })
    tickets_available!: number;

    @Column({ type: 'date', nullable: false })
    event_date?: string;

    @Column({ type: 'text', nullable: false })
    status!: string;

    @Column({ type: 'text', nullable: false })
    image!: string;

    @ManyToOne(() => Venue)
    @JoinColumn({ name: 'venue_id' })
    venue!: Venue;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category!: Category;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    date?: string;
}
