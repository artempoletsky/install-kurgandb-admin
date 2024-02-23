
This is a [KurganDB](https://github.com/artempoletsky/kurgandb) admin panel for [Next.js](https://nextjs.org/)
 

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
