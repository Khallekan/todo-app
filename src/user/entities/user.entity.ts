import * as argon from 'argon2';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Task } from 'src/task/entities/task.entity';
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ nullable: false, type: 'varchar', unique: true })
  @IsEmail()
  @Transform((param) => (param.value as string).toLowerCase())
  @IsString()
  @IsNotEmpty()
  email: string;

  @Column({ nullable: false })
  password: string;

  private tempPassword: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;

    this.password = await argon.hash(this.password, {
      secret: Buffer.from(process.env.ARGON_PASSWORD_SECRET || ''),
    });

    this.tempPassword = null;
  }

  @BeforeUpdate()
  private async hashPasswordAfterUpdate() {
    if (this.tempPassword !== this.password) {
      await this.hashPassword();
    }
  }

  @AfterLoad()
  private loadTempPassword() {
    this.tempPassword = this.password;
  }
}
