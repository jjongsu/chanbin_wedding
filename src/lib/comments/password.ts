import 'server-only';

import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const HASH_PREFIX = 'scrypt';
const KEY_LENGTH = 64;

const timingSafeStringEqual = (left: string, right: string) => {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
};

export const hashCommentPassword = (password: string) => {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');

    return `${HASH_PREFIX}:${salt}:${hash}`;
};

export const verifyCommentPassword = (password: string, passwordHash: string | null) => {
    if (!passwordHash) return false;

    const [prefix, salt, storedHash] = passwordHash.split(':');

    if (prefix !== HASH_PREFIX || !salt || !storedHash) {
        return false;
    }

    const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');

    return timingSafeStringEqual(hash, storedHash);
};

export const verifyAdminPassword = (password: string) => {
    const adminPassword = process.env.COMMENT_ADMIN_PASSWORD;

    if (!adminPassword) {
        return false;
    }

    return timingSafeStringEqual(password, adminPassword);
};
