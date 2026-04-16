/** Value Object para SKU (Stock Keeping Unit) - Identificador único de producto */
export class SKU {
  private constructor(readonly value: string) {}

  static create(value: string): SKU {
    const trimmed = value.trim().toUpperCase();
    
    if (!trimmed) {
      throw new Error('SKU cannot be empty');
    }
    
    if (trimmed.length < 3) {
      throw new Error('SKU must be at least 3 characters');
    }
    
    if (trimmed.length > 50) {
      throw new Error('SKU cannot exceed 50 characters');
    }
    
    if (!/^[A-Z0-9\-_]+$/.test(trimmed)) {
      throw new Error('SKU can only contain uppercase letters, numbers, hyphens and underscores');
    }
    
    return new SKU(trimmed);
  }

  equals(other: SKU): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
