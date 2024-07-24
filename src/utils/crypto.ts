import { createHash } from 'crypto';

export default class CryptoUtils {
    public static hashString(input: string): string {
        const hash = createHash('sha256');
        hash.update(input);
        return hash.digest('hex');
    }
}
