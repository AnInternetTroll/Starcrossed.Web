# Starcrossed.Web
A web client for starcrossed.

# Install Instructions

```sh
yarn install
yarn build
yarn start
```

or `yarn install && yarn dev` for development mode.

# FAQ
Q: Why does this look so bad?
A: [Graphic design is my passion](https://tenor.com/view/graphic-design-is-my-passion-designer-terrible-dont-quit-your-day-job-lol-gif-12274412)

Q: Why NextJS?
A: In the beginning I wanted this to work something like discord. With the room IDs in the URL. I've quickly realised that it was going to be too much trouble so I scrapped the idea. Now NextJS remains as a relic of legacy code (which is 2 weeks old).

Q: Why don't live updates work?
A: So the API spec defines the authentification token to be passed in a header field called `Authorization`. Simple enough right? Nope. Browser JavaScript spec doesn't support custom headers. If you can't authentificate then you can't get messages.

Q: How do I add a person to a room?
A: Good luck with this

```graphql
mutation {
  addMemberToRoom(members: ["username"], room: "room_id") {
    owner {
      username
      _id
    }
    members {
      _id
      username
    }
    name
  }
}
```

Q: What did you learn while doing this?
A: A couple of things:
	- I now understand firebase's target audience.
	- WebSockets are not easy.
	- States are messy.
	- I need better planning.
