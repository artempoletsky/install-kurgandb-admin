
This is a [KurganDB](https://github.com/artempoletsky/kurgandb) admin panel for [Next.js](https://nextjs.org/)
 

## Getting Started

First, create a fresh next.js app. If you want add the admin panel to existing next.js project skip this step, but your project have to use settings listed below. 
```bash
npx create-next-app
```

Then follow the instructions. You can keep all default settings.

**REQURED SETTINGS** that you can't change: 
-  **use Typescript**,
-  **use Tailwind CSS**, 
-  **use App router**

Read more about `create-next-app`:

https://nextjs.org/docs/app/api-reference/create-next-app

https://github.com/vercel/next.js/tree/canary/packages/create-next-app

Second, move to your created app. 
```bash
cd ./your_app_name
```
and run 
```bash
npx @artempoletsky/install-kurgandb-admin
```
this will install the admin panel to the default `/kurgandb/` route. 

if you want change the location pass an argument
```bash
npx @artempoletsky/install-kurgandb-admin your_address
```

Third, run the next dev server:
```bash
npm run dev
```

Open [http://localhost:3000/kurgandb](http://localhost:3000/kurgandb) with your browser to enter the admin panel.

