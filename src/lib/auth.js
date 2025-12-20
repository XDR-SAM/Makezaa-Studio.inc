import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Extract token from request headers or cookies
 */
export function getTokenFromRequest(request) {
    // Try to get from Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // Try to get from cookies
    const cookies = request.headers.get('cookie');
    if (cookies) {
        const tokenCookie = cookies
            .split(';')
            .find((c) => c.trim().startsWith('token='));
        if (tokenCookie) {
            return tokenCookie.split('=')[1];
        }
    }

    return null;
}
