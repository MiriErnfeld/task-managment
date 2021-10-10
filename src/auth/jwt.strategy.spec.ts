import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from "./jwt.startegy"
import { User } from './user.entity';
import { UserRepository } from "./user.repository";

const mockUserRepository =()=>({
    findOne:jest.fn(),
})

describe('jwtStrategy', ()=>{
    let jwtStrategy: JwtStrategy;
    let userRepository;
    beforeEach(async()=>{
        const module= await Test.createTestingModule({
            providers:[JwtStrategy,{ provide:UserRepository, useFactory:mockUserRepository}]
        }).compile();
        jwtStrategy= await module.get<JwtStrategy>(JwtStrategy);
        userRepository=await module.get<UserRepository>(UserRepository);
    })

    describe("validate", () => {
        it('validation and returns user from repository based on jwtPayload',async() => {
            const user= new User();
            user.username= 'test';
             await userRepository.findOne.mockResolvedValue(user);
             const result = await jwtStrategy.validate({username: user.username});
             expect(userRepository.findOne).toHaveBeenCalledWith({username: user.username});
            expect(result).toEqual(user);

        })

        it('throw an unauthorized exception if user not found',() =>{
         userRepository.findOne.mockResolvedValue(null);
        expect(jwtStrategy.validate({username: 'test'})).rejects.toThrow(UnauthorizedException)
        })
    })
})