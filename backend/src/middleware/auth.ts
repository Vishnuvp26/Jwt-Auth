import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface customRequest extends Request {
    userId?: string | JwtPayload
}

const authToken = (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' })
        }

        jwt.verify(token,
            process.env.JWT_SECRET as string,
            (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid token' })
                }
                console.log(`Middleware auth completed`);

                req.userId = decoded as JwtPayload;
                next();
            })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred during authentication' });
    }
};

export { authToken }