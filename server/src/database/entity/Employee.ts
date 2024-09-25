import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    employeeNo: number

    @Column()
    fullName: string

    @Column()
    joiningDate: string

    @Column({ default: "N/A" })
    resignDate: string

    @Column()
    department: string

    @Column()
    floor: "5" | "6"

    @Column()
    emailId: string

    @Column({ default: "N/A" })
    skypeId: string

}
