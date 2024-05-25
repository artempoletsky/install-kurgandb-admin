
This is a [KurganDB](https://github.com/artempoletsky/kurgandb) admin panel for [Next.js](https://nextjs.org/)

## Key features

1. Everything is extendable. You can add custom buttons to edit fields, add custom views for editing table records and the table itself.
2. Also it has extendable API so you can write your own API methods and use them in the admin. 
3. Code generation. When starting a new project you can design you database structure first and then use code generation to have all needed typescript types in your project.
4. Scripts tab. Just export a javascript function from the `scripts.ts` and the admin panel will have a button to run this script.
5. It doesn't depend on any authentication method. It means you have to provide for the admin panel the authentication status. You can integrate it with your authentication system, for example Next Auth.

## Getting Started

First, create a fresh next.js app. If you want add the admin panel to the existing next.js project skip this step, but your project have to use settings listed below. 
```bash
npx create-next-app
```

Follow the instructions of the installation wizard. You can keep all the settings default.

**REQURED SETTINGS** that you can't change: 
-  **use Typescript**,
-  **use Tailwind CSS**, 
-  **use App router**

Read more about `create-next-app`:

https://nextjs.org/docs/app/api-reference/create-next-app

https://github.com/vercel/next.js/tree/canary/packages/create-next-app

Second, move to your app's directory
```bash
cd ./your_app_name
```
and run:
```bash
npx @artempoletsky/install-kurgandb-admin
```

This will install the admin panel to the default `/kurgandb/` route. 

if you want to change the location pass an argument
```bash
npx @artempoletsky/install-kurgandb-admin your_address
```

Third, run the next dev server:
```bash
npm run dev
```

Open [http://localhost:3000/kurgandb](http://localhost:3000/kurgandb) with your browser to enter the admin panel.

## What do I do next?

Set up you tables structure with admin panel. 

[Implement authorization, scripts, events and validation rules](./FILES.md)
