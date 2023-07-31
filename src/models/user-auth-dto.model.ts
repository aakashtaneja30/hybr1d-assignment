import {Model, model, property} from '@loopback/repository';

@model()
export class UserAuthDto extends Model {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<UserAuthDto>) {
    super(data);
  }
}

export interface UserAuthDtoRelations {
  // describe navigational properties here
}

export type UserAuthDtoWithRelations = UserAuthDto & UserAuthDtoRelations;
