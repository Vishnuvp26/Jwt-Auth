import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/userModel';

// Register
export const signUp = async (req: Request, res: Response): Promise<any> => {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All feilds are required' })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        await newUser.save()
        
        res.status(200).json({ message: 'User registered successfully' })
    } catch (error) {
        console.log(error);
    }
};

// Login
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill both feilds' })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const truePassword = await bcrypt.compare(password, user.password)
        if (!truePassword) {
            return res.status(404).json({ message: 'Invalid credentials' })
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '2m' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error)
    }
};