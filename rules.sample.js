module.exports = [
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
];
