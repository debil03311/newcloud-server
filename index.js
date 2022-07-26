import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 3000;
const __dirname = process.cwd();

import * as fs from 'node:fs';
import * as path from 'node:path';

import { App } from '@tinyhttp/app';
import { json } from 'milliparsec';

const app = new App().use(json());

/**
 * @param {Array<{name: String, type: String}>} z
 */
function lol(z) {}

/**
 * @param {String} requestPath 
 * @returns {String}
 */
function getLocalPath(requestPath) {
  // Remove first directory from the request's path
  requestPath = requestPath.replace(/\/.*?(?=\/)/, '');
  return `${__dirname}/root/${requestPath}`;
}

// Ughhhhh
app.get('/favicon.ico', (_, response)=> response.status(404));

/*
 * GET
 */

// Reading files
app.get('/cat/*', (request, response)=> {
  const localPath = getLocalPath(request.path);

  if (!fs.existsSync(localPath))
    return response.status(404).send(null);

  return (fs.statSync(localPath).isFile())
    ? response.status(200).json(fs.readFileSync(localPath, 'utf-8'))
    : response.status(406).send('Not a file') // Not Acceptable
});

app.get('/ls/*', (request, response)=> {
  const localPath = getLocalPath(request.path);

  if (!fs.existsSync(localPath))
    return response.status(404).send(null);

  const directoryContent = fs.readdirSync(localPath)
    .map((child)=> ({
      name: child,
      type: fs.statSync(`${localPath}/${child}`).isFile()
        ? 'file'
        : 'folder'
    }))

  return (fs.statSync(localPath).isDirectory())
    ? response.status(200).json(directoryContent)
    : response.status(406).send('Not a directory') // Not Acceptable
});

/*
 * POST
 */

app.post('/write/*', (request, response)=> {
  const localPath = getLocalPath(request.path);
  const fileContent = request.body.content;

  if (!fs.existsSync(localPath))
    return response.status(404).send('File does not exist');

  if (!fs.statSync(localPath).isFile())
    return response.status(405) // Method Not Allowed
      .send('Can not edit a directory')

  if (!fileContent)
    return response.status(406) // Not Acceptable
      .send('File content can not be empty')

  fs.writeFileSync(localPath, fileContent);
  return response.status(200).send('File overwritten sucessfully');
});

app.post('/touch/*', (request, response)=> {
  const localPath = getLocalPath(request.path);

  if (fs.existsSync(localPath)
  &&  fs.statSync(localPath).isFile())
    return response.status(409) // Conflict
      .send('This file or a directory with the same name already exists')
  
  fs.writeFileSync(localPath, '');
  response.status(201); // Created

  // On the NewCloud filesystem
  const filePath = request.path.replace(/\/.*?(?=\/)/, '');
  return response.send('File created successfully');
});

app.post('/mkdir/*', (request, response)=> {
  const localPath = getLocalPath(request.path);

  if (fs.existsSync(localPath))
    return response.status(409) // Conflict
      .send('This directory or a file with the same name already exists')

  fs.mkdirSync(localPath);
  response.status(201);

  const directoryPath = request.path.replace(/\/.*?(?=\/)/, '');
  return response.send('Directory created successfully'); // Created
});

/*
 * DELETE
 */

app.delete('/rm/*', (request, response)=> {
  if (request.path === '/rm/')
    return response.status(403).send('Can not delete the root directory'); // Forbidden

  const localPath = getLocalPath(request.path);

  if (!fs.existsSync(localPath))
    return response.status(404).send(null);

  fs.rmSync(localPath, { recursive: true });
  return response.status(200).send('Deleted sucessfully');
});

app.listen(PORT, ()=> console.log(`Listening on :${PORT}`));