import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ type: 'text', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: false })
  email!: string;

  @Column({ type: 'text', nullable: false })
  password!: string;

  @Column({ type: 'text', nullable: false })
  security_question!: string;

  @Column({ type: 'text', nullable: false })
  security_answer!: string;

  @Column({ type: 'date', nullable: false })
  dob?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date?: string;

  @Column({type: 'text'})
  user_role!: string
}
