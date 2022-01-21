# jwt-auth-service

Service to perform JWT based authentication.

***Mainly used for development purposes. For sensitive / critical secured
applications a more sustainable solution like [Keycloak](https://www.keycloak.org/),
[Authelia](https://www.authelia.com/) or a hosted authentication provider should be preferred.***

## Usage

After starting the service (see below) there is one major HTTP API to perform a login and receive a JWT:

http://localhost:9999/login

This has to be queried by HTTP POST with a post body like

```json
{
	"user": "kalle",
	"password": "123456"
}
```

## Run service

### Add credentials

Create a user.json in the config folder. The file acts as a user registry and defines the user to allow a login for. Never publish this file in a public repo or share it.

```json
{
  "kalle": {"password": "$2b$10$1gam.1MtkGijZenOF6j34OXkMFsJ5Q7OcUmqJjCGzfxnnMtB.u75q"}
}
```

### Add secret

Create a secret.js in the config folder. The file contains the secret for the JWT creation/validation. Never publish this secret in a public repo or share it.

```js
export default 'MY_SUPER_SECRET';
```

`user.json` and `secret.js` have to be mounted in case of running as Docker image.

### Run as Docker container

```bash
# run as Docker container
docker run -p 9999:9999 -e EXPOSE_VALIDATE=true -v $(pwd)/config:/opt/config meggsimum/jwt-auth-service
```

### Build and start locally with Docker

```bash
# build Docker container
docker build -t meggsimum/jwt-auth-service .

# run as Docker container
docker run -p 9999:9999 -e EXPOSE_VALIDATE=true meggsimum/wt-auth-service
```

## Dev setup

The dev setup needs Node.js in version 16 or higher.

Perform the following steps in a terminal to start the dev server:

```bash
cd /path/to/this/checkout/repo

npm i

npm run dev
```
Open http://localhost:9999/vaidate in a browser (gives you a HTTP 401 - Unauthorized)
