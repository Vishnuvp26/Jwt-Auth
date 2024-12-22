import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../model/userModel';

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET as string);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};