import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';

export enum PaymentStatus {
  CompletedPayment = 'CompletedPayment',
  CancelledPayment = 'CancelledPayment',
  WaitingPayment = 'WaitingPayment',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column('decimal')
  totalPrice: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  order: Order;
}
