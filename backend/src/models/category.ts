import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Category {
    @PrimaryGeneratedColumn("uuid")
    category_id!: string;

    @Column({ type: 'text', nullable: false })
    category_name!: string;

    @Column({ type: 'text', nullable: false })
    description!: string;
}
