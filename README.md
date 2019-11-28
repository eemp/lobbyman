# Lobbyman

A configurable cloudflare proxy worker.

Sample config (`rules.js`):

```
[
    {
        pattern: '(http(s)\\://)(:subdomain.):domain.:tld/_analyze',
        target: 'https://example.test/_analyze',

        // Optional Basic Auth
        username: 'username',
        password: 'password',
    },
    {
        pattern: '(http(s)\\://)test.:domain.:tld(/*)',
        target: 'https://example.test/{{ _ }}',
    },
]
```

## Getting Started

1. `mv rules.sample.js rules.js`
2. `npx wrangler preview --watch`
3. Update rules.js
4. Update wrangler.toml
5. `npx wrangler publish [--env production]`

Live Demos are hosted on `workers-tooling.cf/demos/router`:
[Demo /bar](http://workers-tooling.cf/demos/router/bar) | [Demo /foo](http://workers-tooling.cf/demos/router/foo)

#### Wrangler

You can use [wrangler](https://github.com/cloudflare/wrangler) to generate a new Cloudflare Workers project based on this template by running the following command from your terminal:

```
wrangler generate myApp https://github.com/cloudflare/worker-template-router
```

Before publishing your code you need to edit `wrangler.toml` file and add your Cloudflare `account_id` - more information about publishing your code can be found [in the documentation](https://workers.cloudflare.com/docs/quickstart/configuring-and-publishing/).

Once you are ready, you can publish your code by running the following command:

```
wrangler publish
```

#### Serverless

To deploy using serverless add a [`serverless.yml`](https://serverless.com/framework/docs/providers/cloudflare/) file.
