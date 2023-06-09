//CÓDIGO CREADO Y ADAPTADO POR https://github.com/GataNina-Li

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import fse from 'fs-extra'

const readdir = promisify(fs.readdir)
const readFile = promisify(fse.readFile)

let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!text) throw `*POR FAVOR RSCRIBA EL NOMBRE DEL ARCHIVO O EL COMANDO PARA ENVIAR EL CÓDIGO*\n*EJEMPLO*\n\n*${usedPrefix + command} menu-menu.js*\n*${usedPrefix + command} menu*`

const pluginsDir = './plugins'
const files = await readdir(pluginsDir)
try {
  
const nombreArchivo = text.replace(/\.js$/, '') 
const contenidoArchivo = `${nombreArchivo}.js`

const contenido = await readFile(path.join(process.cwd(), pluginsDir, contenidoArchivo))
await conn.sendMessage(m.chat, { document: contenido, mimetype: 'text/javascript', fileName: contenidoArchivo }, { quoted: m })
await m.reply(`\`\`\`CÓDIGO DEL ARCHIVO ${contenidoArchivo}\`\`\`\n${String.fromCharCode(8206).repeat(850)}\n${contenido.toString()}`)
return
} catch (err)  {
 
let matchingFile;
for (let file of files) {
const plugin = (await import(path.join(process.cwd(), pluginsDir, file))).default
try {
if (plugin && plugin.command && plugin.command.test(text) && text.match(plugin.command)) {
matchingFile = file;
break

}} catch (err) {
//return m.reply(`*ERROR EN EL ARCHIVO ${file}*`)
console.log(err.message)
}}

if (!matchingFile) {
return m.reply(`*EL CÓDIGO PARA '${text}' NO FUE ENCONTRADO*`)
}

try{
/*const plugin = (await import(path.join(process.cwd(), pluginsDir, matchingFile))).default
const filename = matchingFile.replace('.js', '')
const fileContent = await readFile(path.join(process.cwd(), pluginsDir, matchingFile), 'utf-8')  
let fileContentT = await fs.readFileSync(`./plugins/${filename}.js`)

await conn.sendMessage(m.chat, { document: fileContentT, mimetype: 'text/javascript', fileName: filename + '.js' }, { quoted: m })
await m.reply(`\`\`\`CÓDIGO DEL ARCHIVO ${filename}.js\`\`\`\n${String.fromCharCode(8206).repeat(850)}\n${fileContent.toString()}`)*/
  
const plugin = (await import(path.join(process.cwd(), pluginsDir, matchingFile))).default;
const filename = matchingFile.replace('.js', '');
const fileContent = await readFile(path.join(process.cwd(), pluginsDir, matchingFile), 'utf-8');
let fileContentT = await fs.readFileSync(`./plugins/${filename}.js`);

let matchingCommand = null;
let textMatched = false;

if (Array.isArray(plugin.command)) {
  for (let command of plugin.command) {
    if (m.text.trim().startsWith(command.trim())) {
      matchingCommand = command;
      textMatched = true;
      break;
    }
  }
} else if (plugin.command instanceof RegExp) {
  const match = m.text.match(plugin.command);
  if (match !== null) {
    matchingCommand = match[0];
    textMatched = true;
  }
}

if (Array.isArray(plugin.customPrefix)) {
  for (let prefix of plugin.customPrefix) {
    if (m.text.trim().startsWith(prefix.trim())) {
      textMatched = true;
      break;
    }
  }
} else if (plugin.customPrefix instanceof RegExp) {
  if (plugin.customPrefix.test(m.text)) {
    textMatched = true;
  }
}

if (textMatched && (matchingCommand !== null || plugin.customPrefix.test(m.text))) {
  await conn.sendMessage(m.chat, { document: fileContentT, mimetype: 'text/javascript', fileName: filename + '.js' }, { quoted: m });
  await m.reply(`\`\`\`CÓDIGO DEL ARCHIVO ${filename}.js\`\`\`\n${String.fromCharCode(8206).repeat(850)}\n${fileContent.toString()}`);
} else {
  await m.reply(`El mensaje "${m.text.trim()}" no coincide con ningún comando o prefijo personalizado del archivo "${matchingFile}".`);
}



 
} catch (err) {
console.log(`Error al enviar el archivo '${matchingFile}': ${err.message}`)
return m.reply(`Ocurrió un error al enviar el archivo '${matchingFile}'`)
}}}

handler.command = /^(getplugin|gp|obtenercodigo|obtenercode|getpg)$/i
handler.owner = true

export default handler















