const _ = require('lodash')
const UrlPattern = require('url-pattern')

const rules = require('./rules')

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const matchedRule = rules.find(ruleMatcher(request))
    if (matchedRule) {
        return handleRule(request, matchedRule)
    }

    return fetch(request);
}

async function handleRule(request, matchedRule) {
    const { headers, password, username, redirect:redirectCode, target } = matchedRule

    const url = new URL(template(target, ruleMatcher(request)(matchedRule)))

    if (redirectCode) {
        return Response.redirect(url.toString(), redirectCode);
    }

    if (username && password) {
        request = new Request(request)
        request.headers.set(
            'Authorization',
            basicAuthHeaderValue(username, password)
        )
    }

    let response = request.method !== 'OPTIONS'
        ? await fetch(url, request)
        : new Response(null, {
            status: 204,
        });
    if(headers) {
        response = new Response(response.body, response);
        Object.keys(headers).forEach(header => {
            response.headers.set(header, headers[header]);
        });
    }

    return response;
}

function ruleMatcher(request) {
    const requestUrl = new URL(request.url)

    return rule => {
        const pattern = new UrlPattern(rule.pattern)
        return pattern.match(requestUrl.toString())
    }
}

// substitute for _.template
// cannot run eval in cloudflare workers
function template(string, params) {
    var result = string
    for (var key in params) {
        const value = params[key]
        result = result.replace(
            new RegExp(`{{\\s*${key}\\s*}}`, 'g'),
            params[key]
        )
    }

    // replace any outstanding placeholders
    result = result.replace(
        new RegExp(`{{\\s*\\w+\\s*}}`, 'g'),
        ''
    )

    return result
}

function basicAuthHeaderValue(username, password) {
    return 'Basic ' + new Buffer(`${username}:${password}`).toString('base64')
}
