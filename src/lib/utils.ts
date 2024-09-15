import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  //Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts.
  return twMerge(clsx(inputs))
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__')
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`
}