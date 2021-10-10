import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

describe('UserRepository',() => {
    let userRepository;

    const mockCredentials = {username: 'testuser', password: 'test!'}
    beforeEach(async() => {
        const module= await Test.createTestingModule({
            providers:[UserRepository]
        }).compile();
        userRepository = await module.get<UserRepository>(UserRepository);
    })
    
    describe('signUp',() => {
        let save;
        beforeEach(() => {
            save=jest.fn();
            userRepository.create=jest.fn().mockResolvedValue({save});
        })
        it('success sign up',() => { 
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentials)).resolves.not.toThrow();
        })
        it('throw a conflict exception when user does not exist', () => {
            save.mockRejectedValue({code: '23505'});
            expect(userRepository.signUp(mockCredentials)).rejects.toThrow(ConflictException);
        })
        it('throw an other exception', () => {
            save.mockRejectedValue({code: '12345'});
            expect(userRepository.signUp(mockCredentials)).rejects.toThrow(InternalServerErrorException);
        })
    })

    describe('validate user password', () =>{
        let user;
        beforeEach(() =>{
            userRepository.findOne=jest.fn();
            user = new User();
            user.username = 'test';
            user.validatePassword= jest.fn();
        })
        it('returns username and validate password',async () =>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const result = await userRepository.validateUserPassword(mockCredentials);
            expect(result).toEqual(user.username);
        })
        it('returns null as user not found',async() =>{
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateUserPassword(mockCredentials);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        })
        it('returns null as password is not valid',async() =>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validateUserPassword(mockCredentials);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        })
        describe('hashPassword',() => {
            it('calls bcrypt.hashPassword to generate a password',async () => {
                bcrypt.hash= jest.fn().mockResolvedValue('testHash');
                expect(bcrypt.hash).not.toHaveBeenCalled();
               const result = await userRepository.hashPassword('testPassword','salt');
                expect(bcrypt.hash).toHaveBeenCalledWith('testPassword','salt');
                expect(result).toEqual('testHash');
            })
        })

    })
})