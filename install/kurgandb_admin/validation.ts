
import { RecordValidator } from "@artempoletsky/kurgandb/globals";

export const users: RecordValidator = (users, { z }) => {
  return z.object({
    username: z.string().min(1, "Required"),
    password: z.string().length(32, "Must be an md5 hash"),
    isAdmin: z.boolean(),
    about: z.string().max(1024, "Description is too long!"),
  });
}
