## Hapi Svelte Views

Status: Working, but experimental

### Installation and Usage

```bash
npm install --save-dev hapi-svelte-views vision
```

```js
  // server.js
  const Vision = require('@hapi/vision')
  const Svelte = require('hapi-svelte-views')

  // ... your server set-up here ...

  // Register Vision and Svelte plugins
  await server.register(Vision);
  await server.register(Svelte);

  // Configure Vision / Svelte plugins
  server.views({
    engines: {
      svelte: Svelte
    },
    relativeTo: __dirname,
    path: 'views' // Put your .svelte components into 'views'
  })

  // Some Route
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      // Render Home view and pass it some props
      return h.view('Home', { name: 'World' })
    }
  })
```

```js
  // views/Home.svelte
  <h1>Hello {name}!</h1>
```