import { IsDateString } from 'class-validator';
export class ProcessPayrollDto {
  @IsDateString() payPeriodStart!: string;
  @IsDateString() payPeriodEnd!: string;
}
