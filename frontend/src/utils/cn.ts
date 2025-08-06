// Utility function for combining class names efficiently
// Lightweight implementation without external dependencies

type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassDictionary;
type ClassArray = ClassValue[];
type ClassDictionary = Record<string, any>;

/**
 * Combines class names and filters out falsy values
 * This is a lightweight implementation similar to clsx
 * 
 * @param inputs - Class names to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const result = cn(...input);
      if (result) classes.push(result);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }
  
  return classes.join(' ');
}

/**
 * Simple class name combiner without Tailwind merging
 * Use this when you don't need Tailwind class conflict resolution
 * 
 * @param classes - Class names to combine
 * @returns Combined class string
 */
export function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Conditional class name helper
 * 
 * @param condition - Boolean condition
 * @param trueClass - Class to apply when condition is true
 * @param falseClass - Class to apply when condition is false
 * @returns Appropriate class string
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass: string = ''
): string {
  return condition ? trueClass : falseClass;
}

/**
 * Variant class helper for component variants
 * 
 * @param variants - Object mapping variant names to class strings
 * @param activeVariant - Currently active variant
 * @param defaultVariant - Default variant to use if activeVariant is not found
 * @returns Class string for the active variant
 */
export function variantClass<T extends string>(
  variants: Record<T, string>,
  activeVariant: T,
  defaultVariant?: T
): string {
  return variants[activeVariant] || (defaultVariant ? variants[defaultVariant] : '');
}