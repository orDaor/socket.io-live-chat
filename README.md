## Socket.IO Live Chat

## Try this Live Chat at [Heroku](https://limitless-hamlet-68919.herokuapp.com/)!

Responsive Live Chat with **Socket.IO** - Create an **account** and send an **invitation** link to your friends to start chatting with them. **Save** all your chats and **messages**. Authentication handled with **JWT**. App built with Node.js/Express, Socket.IO and MongoDB. No frontend framework is used.

## HOW DOES IT WORK?

There is one **main** web **page**, where the DOM gets continuously updated by JavaScript.

### Initialization
- As soon as the user loads the web page, JS will look for a **JWT** stored in the browser **localStorage**:

    - If **no token** is found, the user is requested to login with to get and save a new valid token.

    - If a **token is found**, then the the client will use this token to perform these subsequent actions:

        - **fetch** all the **chats** for this user (first 20 messages for each chat are collected), and display them on screen.
        - **request** the server to open a **websocket** connection. On this socket


- The **JWT** contains in the payload the **userId** of the account with which the user logged in.

- **<ins>NOTE</ins>**: Socket.IO package will always try first to establish a websocekt connection. If this is not possible for some technical reason, then the package will fallback to a long polling transport type to simulate a real time communication.



### Chat View
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

### Invitation link handling
- When a user **accesses** to an invitation **link**, he/she will be asked to login if not legged in yet, and then he/she will be able to **accept** or **deny** the invitation.  
If the invitaion is accepted, both inviter and invited users will be able to immediately chat between each other and monitor their online or typing status. The **inviter** will be **notified** when the invitation is accepted.