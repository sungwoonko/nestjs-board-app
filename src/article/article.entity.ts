import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/auth/user.entity";


@Entity()
export class Article{
    @PrimaryGeneratedColumn() // PK + Auto Increment
    id: number;

    @Column()  // General Colum
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: ArticleStatus;

    @ManyToMany(Type => User, user => user.articles, {eager: false}) // == lazy loading 상태
    user: User;
}