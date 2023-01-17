import chalk from 'chalk'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as fs from 'fs'
import sass from 'sass'
import liveServer from "@compodoc/live-server"
import cssEscape from 'cssesc'
import stripAnsi from 'strip-ansi'


const createCSSErrorTemplate = (error) => {
  let message = cssEscape(stripAnsi(error.message))
  return `
body::before {
  font-family: "Source Code Pro", "SF Mono", Monaco, Inconsolata, "Fira Mono", "Droid Sans Mono", monospace, monospace;
  background: yellow;
  white-space: pre;
  display: block;
  padding: 1em;
  margin-bottom: 1em;
  border-bottom: 4px solid black;
  content: "${message}";
}
  `.trim()
}

var params = {
	port: 6789,
	host: "0.0.0.0",
	root: `${__dirname}/..`,
	open: true,
	file: `index.html`,
	wait: 1000,
	logLevel: 2,
	middleware: [
    (_req, _res, next) => {
      const outputFile  = `${__dirname}/../css/notch.css`
      try {
        console.log(chalk.blue(`\nNUDGE: compiling notch.css...`))
        const result = sass.compile(`${__dirname}/../main.sass`);
        fs.writeFileSync(outputFile, result.css, {force: true})
        console.log(chalk.green(`NUDGE: output new styles to notch.css`))
      } catch (error) {
        console.log(chalk.red(`NUDGE: sass compile error:`))
        console.error(error.message)
        fs.writeFileSync(outputFile, createCSSErrorTemplate(error), {force: true})
      }
      next();
    }
  ]
};

liveServer.start(params);
