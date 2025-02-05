import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { BoardStatus } from "./boards-status.enum";
import { User } from "src/auth/users.entity";


@Entity()
export class Board{
    @PrimaryGeneratedColumn() // PK + Auto Increment
    id: number;

    @Column()  // General Colum
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: BoardStatus;

    @ManyToMany(Type => User, user => user.boards, {eager: false})
    user: User;
}