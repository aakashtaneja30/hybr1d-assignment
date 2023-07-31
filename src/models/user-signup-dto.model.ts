import { model, property} from '@loopback/repository';
import { User } from './user.model';

@model()
export class UserSignupDto extends User {

  @property({
    type: 'string',
    required: true,
  })
  password: string;
  
  constructor(data?: Partial<UserSignupDto>) {
    super(data);
  }
}

