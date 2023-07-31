import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Order, OrderProduct, PlaceOrderDto, User} from '../models';
import {OrderProductRepository, OrderRepository, ProductRepository, UserRepository} from '../repositories';
import { FilterModifyService } from '../services';
import { inject, service } from '@loopback/core';
import { Permission, Role } from '../enum';
import { AuthenticationBindings, STRATEGY, authenticate } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository : OrderRepository,
    @service(FilterModifyService)
    public filterModifyService:FilterModifyService,
    @repository(ProductRepository)
    public productRepository : ProductRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(OrderProductRepository)
    public orderProductRepository:OrderProductRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: User,
  ) {}


  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permission.CreateOrder]})
  @post('/buyer/create-order/{sellerId}')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlaceOrderDto, {
            title: 'NewOrder'
          }),
        },
      },
    })
    placeOrderDto: PlaceOrderDto,
    @param.path.string('sellerId') sellerId?: string,
  ): Promise<Order> {

    if(!placeOrderDto.productIds.length){
      throw new HttpErrors.BadRequest("Product Ids not provided");
    }
    if(!(await this.userRepository.find({where:{id:sellerId, role:Role.SELLER}}))){
      throw new HttpErrors.BadRequest("Invalid Seller ID")
    }

    const products= await this.productRepository.find({where:{id:{inq:placeOrderDto.productIds}}});

    if(products.length!==placeOrderDto.productIds.length){
      throw new HttpErrors.BadRequest("Invalid Product Ids Provided");
    }

    if(products.some(p=>p.sellerId!==sellerId)){
      throw new HttpErrors.BadRequest("Some Products Do Not belong to this seller");
    }

    const order = await this.orderRepository.create({sellerId, buyerId:this.currentUser.id})

    
    const promiseArray:Promise<OrderProduct>[]=[];

    placeOrderDto.productIds.forEach(id=>{
      promiseArray.push(
        this.orderProductRepository.create({productId:id, orderId:order.id})
      )
    })

   await Promise.all(promiseArray)

    return order
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [Permission.ViewOrder]})
  @get('/seller/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Order) filter?: Filter<Order>,
  ): Promise<Order[]> {
    filter= this.filterModifyService.addRoleConstraintToFilter({sellerId:this.currentUser.id}, filter) as Filter<Order>
    return this.orderRepository.find(filter);
  }

}

