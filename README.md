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

- When the client **requests** the **chats** of a user with a given token pointing to that userId, ther server will find in the the database all the rooms in which this user is active. It will convert each room in a ChatViewData class object, that contains the last 20 messages that were sent in the context of that room. This chat objects are then collected inside of an array and send back in the response to the user:
    - In the **chats** array, the chats are sorted **from the most recent to the eldest**.
    - The **messages** in each chat object, are ordered **from the eldest to the most recent**.

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

## 3-RD PARTY PACKAGES
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
