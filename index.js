//@ts-check
const fs = require("node:fs");
const { JSDOM } = require('jsdom');
(async function () {
    for (let index = 1; index <= 183; index++) {
        await parseThemes("https://localhost/?page=" + index, index)
        console.log("parsed " + index)
    }
}())

const sanitizeHtml = html => {
    return html?.replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/gim, '')?.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/gim, '')
}

async function htmlToDocument(url) {
    const response = await fetch(url)
    const text = await response.text();

    const dom = new JSDOM(sanitizeHtml(text));

    return dom;
}


async function parseHtml(url) {

    const dom = await htmlToDocument(url);

    const nodes = dom.window.document.querySelectorAll('div.text.node.dissertation.teaser')
    nodes.forEach(node => {
        const table = node.querySelector('table');
        const tbody = table?.querySelector('tbody');
        const tr = tbody?.querySelectorAll('tr').item(4);
        const td = tr?.querySelector('td');

        if (td?.textContent?.startsWith('2.3.')) {
            const div = node.querySelector('div.more')
            const a = div?.querySelector('a')
            console.log('found ' + a?.href)
            fs.appendFileSync('urls.txt', String(a?.href) + '\n')
        }
    })
}

async function parseThemes(url, page) {
    fs.appendFileSync('urls.txt', `Page: ` + page + '\n')
    const dom = await htmlToDocument(url);
    const nodes = dom.window.document.querySelectorAll('div.text.node.dissertation.teaser')
    nodes.forEach(node => {
        const table = node.querySelector('table');
        const tbody = table?.querySelector('tbody');
        const tr = tbody?.querySelectorAll('tr').item(1);
        const td = tr?.querySelector('td');
        const div = node.querySelector('div.more')
        const a = div?.querySelector('a')

        fs.appendFileSync('urls.txt', `\t` + td?.textContent + ': ' + a?.href + '\n')
    })

}
