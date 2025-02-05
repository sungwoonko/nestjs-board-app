import { IsNotEmpty, IsString, Matches } from "class-validator";

export class createBoardDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;

}