import { v4 as uuidv4 } from 'uuid';

export class StrUtil {
  static generateUuid(): string {
    return uuidv4();
  }
}
