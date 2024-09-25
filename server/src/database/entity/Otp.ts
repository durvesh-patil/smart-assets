import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Otp {

    @Column()
    otp: number

    @PrimaryColumn()
    email: string

    @Column({ default: new Date().toString() })
    created_at: string
}
