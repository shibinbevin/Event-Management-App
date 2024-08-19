import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import User from '../models/user';
import Event from '../models/event';

@Entity()
export default class Ticket {
    @PrimaryGeneratedColumn("uuid")
    ticket_id!: string;

    @Column({ type: 'text', nullable: false })
    ticket_count!: number;

    @ManyToOne(() => Event)
    @JoinColumn({ name: 'event_id' })
    event!: Event;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    date?: string;
}
