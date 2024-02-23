import { Predicate, queryUniversal } from "@artempoletsky/kurgandb";

export async function query(predicate: Predicate<any, any>, payload?: any) {
  return queryUniversal(predicate, payload);
}