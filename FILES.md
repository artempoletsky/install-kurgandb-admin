[Back to the main page](./README.md)

```bash
npx install-kurgandb-admin 
```
creates a folder `kurgandb_admin` where you can customize the admin panel and `KurganDB` itself.

## auth.ts

Here developers can implement authorization for the admin panel.

Example implementation: 
```ts
export async function isAdmin(): Promise<boolean> {
  const session = getSession();
  return session.isAdmin;
}

export async function login(username: string, password: string): Promise<boolean> {
  const session = getSession();


  const [success, isAdmin] = await query(({ users }, { payload, $ }) => {
    let isAdmin = false;
    let success = false;
    if (users.has(payload.username)) {
      const user = users.at(payload.username, $.full);
      success = $.encodePassword(payload.password) == user.password;
      isAdmin = user.isAdmin;
    }
    return [success, isAdmin]
  }, { username, password });


  if (success) {
    session.isAdmin = isAdmin;
    session.username = username;
  }

  return success;
}

export async function logout(): Promise<void> {
  const session = getSession();
  session.isAdmin = false;
  session.username = undefined;
}
```


## events.ts

Hasn't been implemented yet.

Here developers can register events for `KurganDB`

You can use events for gathering metadata and other things.


## scripts.ts

Here developers can write custom scripts, and run them from the `scripts` page in the admin panel.

## validation.ts

Hasn't been implemented yet.

Here developers can specify validation rules for the documents in the database.
