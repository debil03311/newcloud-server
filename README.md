# newcloud-server

NewCloud is a minimalistic web-based operating system and has two parts to it: the client and the server. The server provides a persistent filesystem and a few basic core commads, and the client provides a user-friendly interface for interacting with the server.

**NOTE:** Since the aim is to be as minimal as possible, only the bare minimum of security features exist. As it is, anyone can create and delete any files, so you shouldn't be using this for any serious purposes.

## Commands

The few server-side commands can be run by making appropriate HTTP requests to the server, using the following template:

```
https://example.com/:commandName/:pathToFile*
```

The following commands are available via the following request methods:

- GET
  - `ls` - responds with `Array<{name: String, type: String}>` where type is either `'FILE'` or `'FOLDER'`
  - `cat` - responds with the contents of a file in plain text
- POST
  - `mkdir` - creates a directory
    - `'null'`
  - `touch` - creates a file
    - `'null'`
  - `write` - overwrites the contents of a file
    - `content: String`
- DELETE
  - `rm` - removes a file or directory

## Usage
```javascript
// A new directory will be created inside of the root folder
fetch('https://example.com/mkdir/files', {
  method: 'POST',
  body: 'null'
})

// An empty file will be created inside /files
fetch('https://example.com/touch/files/new_file.txt', {
  method: 'POST',
  body: 'null'
})

fetch('https://example.com/ls/files/')
// [{ name: 'new_file.txt', type: 'file' }]

fetch('https://example.com/write/files/new_file.txt', {
  method: 'POST',
  body: JSON.stringify({ content: 'Hello, world!' })
})

fetch('https://example.com/cat/files/new_file.txt') // Hello, world!

fetch('https://example.com/rm/files/new_file.txt',
  { method: 'DELETE' })
```