# newcloud-server

NewCloud is a minimalistic web-based operating system and has two parts to it: the client and the server. The server provides a persistent filesystem and a few basic core commads, and the client provides a user-friendly interface for interacting with the server.

**NOTE:** Since the aim is to be as minimal as possible, only the bare minimum of security features exist. As it is, anyone can create and delete any files, so you shouldn't be using this for any serious purposes.

## Commands

The few server-side commands can be run by making appropriate HTTP requests to the server, using the following template:

```
https://example.com/:commandName/:pathToFile*
```

The following commands can be excuted via GET requests:
- `mkdir` - creates a directory
- `touch` - creates a file
- `ls` - responds with a JSON `Array<String>` of all the files in a directory
- `cat` - responds with the contents of a file in plain text
- `rm` - removes a file or directory

Additionally, the following POST commands are available:
- `write` - overwrites the contents of a file

## Usage
```javascript
// GET request example
// A new, empty file will be created inside the /files directory
fetch('https://example.com/touch/files/file.txt')

// POST request example
// The file we've just created will now contain the text "Hello, world!"
fetch('https://example.com/write/files/file.txt', {
  method: 'POST',
  body: JSON.stringify({
    content: 'Hello, world!'
  })
})
```