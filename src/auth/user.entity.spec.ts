import * as bcrypt from 'bcrypt'
import { User } from './user.entity';

describe('userEntity',()=>{
    describe('validatePassword',()=>{
        let user: User;
        beforeEach(()=>{
            user= new User();
            user.salt='salt';
            user.password='password';
            bcrypt.hash=jest.fn();
        })
        it('returns true if the password is valid',async ()=>{
            bcrypt.hash.mockResolvedValue('password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result=await user.validatePassword('1234');
            expect(bcrypt.hash).toHaveBeenCalledWith('1234','salt');
            expect(result).toEqual(true);
        })
        it('returns false if the password is invalid',async()=>{
            bcrypt.hash.mockResolvedValue('wrong password');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result=await user.validatePassword('wrong password');
            expect(bcrypt.hash).toHaveBeenCalledWith('wrong password','salt');
            expect(result).toEqual(false);
        })

    })
})