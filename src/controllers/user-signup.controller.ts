import {
  repository,
} from '@loopback/repository';
import {
  post,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {User, UserSignupDto} from '../models';
import {UserRepository} from '../repositories';
import { service } from '@loopback/core';
import { UserSignupService } from '../services';
import { authorize } from 'loopback4-authorization';

export class UserSignupController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @service(UserSignupService)
    public userSignupService: UserSignupService
  ) {}

  @authorize({permissions: ["*"]})
  @post('/auth/register')
  @response(200, {
    description: 'UserSignupDto model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserSignupDto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSignupDto, {
            title: 'NewUserSignupDto',
            exclude: ['id'],
          }),
        },
      },
    })
    userSignupDto: Omit<UserSignupDto, 'id'>,
  ): Promise<User> {
    return this.userSignupService.signupUser(userSignupDto);
  }
}
