import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'sermonia-secret-key';

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET);
    } catch (e) {
        return null;
    }
}

export function signToken(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}
