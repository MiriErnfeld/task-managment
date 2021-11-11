import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity()
@Unique(['username'])//not working
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    async valitaPassword(password: string): Promise<boolean> {
        const hush = await bcrypt.hash(password, this.salt);
        return hush === this.password
    }
}