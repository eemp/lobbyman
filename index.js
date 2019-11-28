const _ = require('lodash')
const UrlPattern = require('url-pattern')

const rules = require('./rules')

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function handler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify({ some: 'json' })
    return new Response(body, init)
}

async function handleRequest(request) {
    const matchedRule = rules.find(ruleMatcher(request))
    if (matchedRule) {
        return handleRule(request, matchedRule)
    }

    return fetch(request)
}

async function handleRule(request, matchedRule) {
    const { password, username, redirect:redirectCode, target } = matchedRule

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

    return fetch(url, request)
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
