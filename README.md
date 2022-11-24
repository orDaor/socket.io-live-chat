## Try this Live Chat at Heroku [Here](https://limitless-hamlet-68919.herokuapp.com/)!

Responsive Live Chat with **Socket.IO** - Create an **account** and send an **invitation** link to your friends to start chatting with them. **Save** all your chats and **messages**. Authentication handled with **JWT**. App built with Node.js/Express, Socket.IO and MongoDB. No frontend framework is used.

## HOW DOES IT WORK?

There is one **main** web **page**, where the DOM gets continuously updated by JavaScript.

### Initialization
- As soon as the user loads the web page, JS will look for a **JWT** stored in the browser **localStorage**:

    - If **no token** is found, the user is requested to **log in** with to get and save a new valid token. If the user does not have any account yet, then he/she must **sign up** before logging in by entering a valid user name and password.

    - If a **token is found**, then the the client will use this token to perform these subsequent actions:

        - **Fetch** all the **chats** for this user (first 20 messages for each chat are collected), and display them on screen.
        - **Request** the server to open a socket, that is a **Websocket** connection. On this socket the user **will be able to chat** with his/her friends and to monitor the online and typing status of his/her friends.


- The **JWT** contains in the payload the **userId** of the account with which the user logged in.

- **<ins>NOTE</ins>**: Socket.IO package will always try first to establish a websocekt connection. If this is not possible for some technical reason, then the package will fallback to a long polling transport type to simulate a real time communication. If the socket gets disconnected (closed) for technical reasons, the Socket.IO client will automatically try to re-open the socket.


### App Views
- After the user logged in, a <ins>Friends Section</ins> will be visible, which contains a list of chats. When the user clicks on a chat, a <ins>Chat Section</ins> will show up, which displays on screen the messages that are exchanged in the context of this chat, together with a text area where the user can send a message.

- **Each chat** represents a **friend**, who invited the user to chat with him/her, or a friend that was invited by the user.

- <ins>Friends Section</ins> and <ins>Chat Section</ins> views are **optimized** for both **mobile** and **desktop** screens.

### Friends Section
- In this section all chats (friends) are collected in a list.

- Here the user can generate an **invitation link**. This needs to be shared with a friend, and if he/she accepts the invitation, then both these users will be able to sent messages to each other. And the inviter will be **notified** that the friend **accepted** the invitation.

- **Each chat** is labeled with the following **informations**:
    - Friend **name**.
    - Friend **online status**.
    - A **preview** of the last **message** sent in this chat.

- **<ins>NOTE</ins>**: if the client failed to load one chat (server failed in collecting messages and/or chat infos), this will not be displayed in the friends list, and an error message will show up.

- A **notifications counter** is displayed and **incremented** every time a new message is received inside a chat which is not currently selected, and which did not have any new content to be viewed. When a chat with new content to be viewed is selected, the counter will **decrement**.
This **counter status** is **saved** (mantained) when reloading the page.

### Chat Section
- This section **displayes** the **messages** exchanged in the selected chat, and lets the user **enter/send** a **message** to the friend related to such chat.

- Here the user can monitor his **friend status**:
    - **Online** status.
    - "**Is typing**" status.


- Here the user can **delete** a **message** that he/she sent.

- The user can also **delete** the selected **chat** (this is the way by which a **friend** is **removed**).

- By **scrolling upwards** the messages list, **more** (+20) **messages** are **loaded** for the selected chat.

- A nice "**double-arrow icon**" is displayed when scrolling upwards the messages to **help** the user **scrolling** them **down** to bottom.

### Invitation Link and Chat Rooms
- When a user requests to **generate** an invitation **link**, a new chat **room** is created in the database, if another room where the user is active alone does not exist yet. This room will contain the user who generated it, as the only user active inside of such room. The invitation link that is returned to the user by the server, contins the **roomId** of the room.

- When a user **accesses** to an invitation **link**, he/she will be asked to log in if not legged in yet, or first to sign up if he/she has no account yet and then to log in. Then he/she will be able to **accept** or **deny** the invitation. If the invitaion is accepted by the user, he/she will be insterted inside the chat room in the database to which the invitation link points. Then, both inviter and invited users will be active inside of the same room.

- After a user accepted **successfully** an invitation:

    - The client will use the user token to perform these actions:
        - **Fetch** all the **chats** for this user (first 20 messages for each chat are collected), and display them on screen.
        - **Request** the server to open a socket, that is a **Websocket** connection. On this socket the user **will be able to chat** with his/her friends and monitor their online and typing status.

    - The **inviter** will be **notified** that his/her invitation was accepted.

- **<ins>NOTE</ins>**: **every chatroom will never have more than 2 active friends** inside of it. And it will not be possible for 2 users to be active in more than one room at the same time.

- **<ins>NOTE</ins>**: after an invitation from a user was accepted, the link can not be used anymore, and the user needs to **generate** a **new link** for inviting a new friend.

### Chats Loading
- When a **message** is **send**, the server will save it in the **database**, and the will **forward** it to the destination users (**recipients**) on their sockets.

- **<ins>NOTE</ins>**: **even if in one chat room only 2 users can be active, the destination users can be more than one in case the sender is logged in at the same time in more browser tabs or browser instances. In this case one or more recipients will conincide with the sender**.

- When the client **requests** the **chats** of a user with a given token pointing to that userId, ther server will find in the the database all the rooms in which this user is active. It will convert each room in a **ChatViewData** class object, that contains the last 20 messages that were sent in the context of that room. This chat objects are then collected inside of an array and send back in the response to the user:
    - In the **chats** array, the chats are sorted **from the most recent to the eldest**, based on their last activity date. The last activity date of a chat is the date when the last message was sent for this chat.
    - The **messages** in each chat object, are sorted **from the eldest to the most recent**.

- The **frontend** collects the received chats in the **chatListGlobal array**:
    - When the user **selects** on **screen** a chat, the frontend will point to that specific chat in chatListGlobal[], get its messages and display them on screen.
    - When the user **loads more messages** for one chat, by scrolling messages list upwards, the new received messages will be **added** inside the selected chat in **chatListGlobal[]**.
    - **Similarly** chatListGlobal[] is **updated** when a user **sends** or **deletes** a **message** in the currently selected chat.

### Online Status
**Every 1.5 seconds**, the user sends on the socket to the server the notification "**I am alive/online**". The server will check to which rooms the user socket is assigned, then it will forward this notification to all sockets (recipients) which are part of those rooms.

### Logging Out
When the user clicks on the log out button, the **token** memorized in the browser localStorage will be **deleted**, and the user is requested to log in again. Together with that, frontend global **variables** are **resetted**, the **timers** which are possibly running are **aborted**. Also all the chats, messages, and user content and info in the **DOM** are **cleaned**.

### HTTP vs Socket Transports
- When the user accesses the website, the TCP connection established with the server will use **HTTP** protocol in a **first moment**. Therefore at the very beginning the **socket** results as closed or "**disconnected**" at the client side, because there is no Websocket connection established yet. This situation will persist until the client requests to upgrade the TCP connection to the Websocket protocol.

- **Before the client requests to open the socket**, all the data exchanged between server and client are handled with HTTP requests and responses.

- **After the socket has been opened**, the data exchange between server and client will occure with Websocket messages.

## MONGODB DATABASE
**NoSQL** MondoDB database is used for storing **user accounts, chat rooms and messages**:

- MondoDB **database** → **_socketio-live-chat_**

- MondoDB **collections** in _socketio-live-chat_ database:
  - _users_
  - _rooms_
  - _messages_
  - _sessions_ → a user session is only used for implementing CSRF protection

## HTTP ROUTES AND CONTROLLERS

**Routes** are groupped in these sets:

- base → renders home and error pages.
- user
- room 
- message

A **controller** is defined for each route set (except for the base routes), and each controller contains its controller actions. In the following are described the **end-points** handled by the different controller actions:

- **user** end-points:

    - **POST: "/user/signup"** → user requests to create a user account with valid name and password, which is saved in the database.
    - **POST: "/user/login"** → user requests to login using credentials (name and password) of an existing user account.
    - **GET: "/user/invitation/invitationId"** → user accesses an invitation link which points to a chat room that he/she is invited to join.

- **room** end-points:

    - **POST: "/room/join"** → user wants to accept an invitation, that is to join a chat room where he/she was invited. In this way inviter and invited users will become "friends".

- **message** end-points:

    - **POST: "/message/readAll"** → user requests to load his/her chats, together with the messages sent in those chats. The server wil return an array of all user's chats (sorted from the most recent to the eldest), and for each chat only the last 20 messages are returned (sorted from the eldest to the most recent). The user will be able to load more messages for a given chat after he/she opened the socket connection.

## SOCKET OPENING AND INITIALIZATION (backend)
- When a client sends the HTTP **request** to the server to **upgrade** the TCP connection from HTTP to **Websocket** protocol, it will attach to the request the **JWT**. This request is handled by a socket **authentication middleware** which will:
    - Check the token validity.
    - Verify whether the user account, for which this token was generated, exists or not.
    - Find in the database all the chat rooms where the user is active.
    - Refuse the connection if the above checks/actions fail, by sending back an error response, otherwise continue as below.
    - Save this chat rooms inside of the socket that the server is going to open for this user.
    - Accept the connection by sending back a 101 Code good response. **When connection is accepted a socket is opened**.

- **When** a socket is **opened**, an **initialization** handler will look for the chat rooms saved inside of it, and will **assign** all those **rooms** to the socket. *This is the way by which users inside of a chat room can communicate between each other*.

## SOCKET LISTENERS AND CONTROLLERS (backend)

**Socket listeners** are groupped in these main sets:
 
- user
- room 
- message

A **controller** is defined for each listener set, and each controller contains its controller actions. In the following are described the **server events** handled by the different controller actions:

- **user** events:

    - **"user-fetch-invitation-link"** → user requests the server to generate an invitation link. If the user has not generated any link yet, a new chat room will be created and he/she will be inserted in there. Then a link which points to this room is generated and sent back to the user. If the user has already generated a link, that link is re-proposed back to the user.

    - **"user-accepted-invitation"** → user wants to notify the other users of a given room, that he/she just accepted an invitation and joined that room. In this way, the user who sent the invitation, will be notified when this is accepted.

- **room** events:

    - **"room-view"** → user requests for a specific chat room to update the last time (date) he/she viewd the content (messages) of that room. The date is updated to the moment this event is fired. 

    - **"room-is-typing"** → user requests to broadcast the information that he/she is currently typing inside of a specific chat room. This notification is broadcasted to the other users inside of that room.

    - **"room-is-online"** → user requests to broadcast to his/her friends the information that he/she is currently online. The server will look for the rooms the user's socket is currently assigned to, and will boradcast this notification to the other users in those rooms.

    - **"room-cancel"** → user wants to remove a friend, which means he/she wants to remove a specific chat room he/she is active in. The server will also remove the user's socket from that room.

- **message** events:

    - **"message-send"** → user requests to send a message to the users of a given chat room, where he/she is active too. The server will save this message in the database, update the last activity date of this room with the message creation date, and then broadcast the message to the other users which are inside of the room.

    - **"message-delete"** → user requests to delete a message that he/she previously sent in the context of a specific chat room. After the message is deleted, the server will broadcast a notification of the message deletion to the other users which are part of the target room.

    - **"message-load"** → user wants to load more messages for a specific chat. The server will look for 20 more messages, collect them in an array (sorted from the most recent to the eldest) and send it back to the user.

## MODELS

The following are the **classes** defined in the backend for handling users and chat rooms (the methods are not listed):

### User

Represents the User account entity. The user account documents in the database have the stracture of this class:

- <ins>properties</ins>:
    - **name** (string)
    - **password** (string)
    - **regitrationDate** (Date class object)
    - **userId** (string) → id of the corresponding document in the database.

### Room

Represents the chat room entity. The room documents in the database have the stracture of this class:

- <ins>properties</ins>:
    - **friends** (Array of strings) → contains ids of users active in this chat room.
    - **lastViewDates** (Array of Date class objects) → contains the last time (date) each friend of this room has viewed the content (messages) of this room.
    - **lastActivityDate** (Date class object) → the date in which was sent the last message in the context of this chat room.
    - **roomId** (string) → id of the corresponding document in the database.

### Message

Represents the message entity. The message documents in the database have the stracture of this class:

- <ins>properties</ins>:
    - **text** (string)
    - **roomId** (string) → the id of the chat room in which the message was sent.
    - **senderId** (string) → id of the user account which sent this message.
    - **creationDate** (Date class object) → the date when this message was sent.
    - **messageId** (string) →id of the corresponding document in the database.

### MessageViewData

The user fetches the messages in the form described by this class, and not in the form they are store in the database:

- <ins>properties</ins>:
    - **text** (string)
    - **creationDate** (Date class object) 
    - **senderIsViewer** (bool) → the user who requested to see this message is the one who actually sent it. This is needed by the client for example to display the message correctly on screen.
    - **messageId** (string) → this is needed by the client for example to request to delete a specific message.
    - **sendingFailed** (bool) → this is handled at client side for marking a message sending as failed.
    - **sendingFailedReason** (string) → this is handled as client side for specifying why the message sending failed.

### Chat

When the user fetches his/her chats, the server finds in the database the chat rooms (room documents) where the user is active. This rooms are collected inside of an array from the most recent to the eldest (sorted based on lastActivityDate), **and each room there is mapped first into a Chat class object, and then into a ChatViewData object**. 

- <ins>properties</ins>:
    - **roomId** (string)
    - **viewerId** (string) → the id of the user who requested to see this chat.
    - **friends** (Array of strings) → contains the ids of the users active in this chat room, **except** the **viewerId**.
    - **friendsNames** (Array of strings) → contains the names of the users active in this chat room, **except the user who requested to see it**.
    - **messages** (Array of MessageViewData class objects) → containes the messages sent in this chat room. These are sorted from the eldest to most recent.
    - **lastViewDate** (Date class object) → last time the user, who requested this chat, has viewd its content (messages)

### ChatViewData

When the user requests his/her chats, these will be sent to him/her in the form represented by this class, as mentioned above. Each chat exposed to the client will contain only the data the user needs to know:

- <ins>properties</ins>:
    - **roomId** (string)
    - **friendsNames** (Array of strings) → the names of the users active in this chat room, except the user who requested to see it.
    - **messages** (Array of MessageViewData class objects) → containes the messages sent in this chat room. These are sorted from the eldest to the most recent.
    - **errorList** (Array of numbers) → contains any error code. If an error occured while collecting the messages or friends names for this chat room, an error code is entered in this list.
    - **viewed** (bool) → if TRUE, the user who is requesting this chat (the viewer), does NOT have any new content (message) to see here. If the last message sent in this chat by the viewer's friends has a creation date which is more recent than the last time the viewer has viewed this chat content (messages), then viewed = FALSE, because the viewer has new content too see here.  
    This flag is used by the frontend to set a notification for new content to be viewed in a chat.

## 3rd PARTY PACKAGES
The following Node.js 3-rd party packages are used for building the backend code:
- express
- socket.io
- mongodb
- bcryptjs
- jsonwebtoken
- uuid
- express-session
- connect-mongodb-session
- csurf
- ejs
- bad-words
