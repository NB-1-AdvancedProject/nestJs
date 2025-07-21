import { Grade } from 'src/grade/grade.entity';
import { UserType } from '../user.entity';

export class UserRes {
  id: string;
  email: string;
  name: string;
  type: UserType;
  point: number;
  gradeId: string;
  grade: Grade;
  image: string;
  provider: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
