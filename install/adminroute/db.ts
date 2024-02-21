import { Predicate, standAloneQuery } from "@artempoletsky/kurgandb";

export async function query(predicate: Predicate<any, any>, payload?: any) {
  return standAloneQuery<any, any>(predicate, payload);
}