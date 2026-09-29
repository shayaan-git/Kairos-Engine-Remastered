## KAIROS REMASTERED

1. Authentication System
2. Chat with AI
3. Chat History
4. Message Storage
5. Ai with internet research feature

session model bhi create karenge kyuki refresh-access token based authentication rahega - JWT bhi hoga

Chat ka alag model create karne ki need padegi.
Why Need: Bohot saare chats ban rahe honge user ke through

- User Model:
  \_id
  username
  email
  password
  verified
  emailVerificationTokenHash
  emailVerificationTokenExpiry
  verificationEmailLastSentAt
  googleId - (for OAuth)
  fullname - (for OAuth)
  profilePic - (for OAuth)
  timestamps

- Session Model:
  \_id
  user (ref) - populate
  refreshTokenHash
  id
  userAgent
  revoked
  timestamps

- Chat Model:
  \_id
  user (ref) - populate
  title
  timestamps

- Message Model:
  \_id
  chat (ref) - populate
  content
  role : {enum: [user, ai]}
  timestamps

---

`NOTES:`
useNavigate hook - Button Click / Form Submit / setTimeout
Navigate component - JSX ke ander - Protected Routes / Conditional Statements

Link - simple navigation -
NavLink - with active navigation -> has state values like isActive, isPending, aur isTransitioning

---

User Register karte time, ek email verify token bana rahe honge and

then uss token ko sendEmail named function ke ander bhej rahe honge kaise

query mein anchor tag ke ander jo ek html ke ander hoga

And jab user ko email mei ye verify link milegi then user link pe click karega to user redirect ko karwa denge verify-email API pe.

Verify-email API query se token legi aur token verify karegi then user ko database mein find karegi.

Agar user mil jata hai db ke ander to uski verification false → true pe set hogi and user verified hojayga jisse,

Finally wo user authorized hojayga aur login karpayga apne account mein.

---

Login mein candidate ke given password ko compare kar rahe hote hain database ke password se

Aur bhi chize check kar rahe hote hain:

- user verification
- password match

Fir refresh aur access token sign karke Cookie mein refresh token set karte hain Aur response mein send karte access token.
---

Ab get-me ek API bana rahe honge jo ki auth middleware se token le raha hoga - authorization header ki help se. Token jise humne cookie mein set karwaya tha login ke time pe.

To ek auth middleware bana rahe honge get-Me API ke route mein use karne ke liye.

---

There is a bigger architectural gap than the cookie issue — it explains everything, including why it fails **even right after a successful login**.

### The design

Your backend uses a two-token pattern:

- **`accessToken`** — short-lived (15m), returned in the **JSON body** of login/refresh. Expected to be sent by the client via `Authorization: Bearer <token>` header on protected routes.
- **`refreshToken`** — long-lived (7d), set as an **httpOnly cookie**, used only to silently mint a new `accessToken` via `/refresh-token`.

`getMe` reads `req.user.id` — meaning some auth middleware (not shown yet) is decoding the `Authorization` header to populate `req.user`. That's the standard pattern for this architecture.

### The break

Look at your frontend again:

```js
async function handleLogin({ email, password }) {
   const data = await login({ email, password });
   dispatch(setUser(data.user)); // <-- accessToken is thrown away here
}
```

`data.accessToken` is never stored anywhere — not in Redux, not in memory, nowhere. And your axios instance:

```js
const api = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true, // <-- only sends cookies, NOT the Authorization header
});
```

has no interceptor attaching an `Authorization` header. So every call to `getMe` goes out with **no access token at all**. If your middleware requires that header to populate `req.user`, it will reject the request as unauthorized — regardless of whether login "succeeded." This matches your exact symptom: login works and shows a user, but `getMe` is unauthorized immediately and after refresh.

This is also _why hydration on refresh is structurally impossible right now_: the access token lives only in JS memory. A full page reload wipes JS memory. So even if you fixed storage, on refresh you'd have no access token again — you'd need to use the refresh cookie to mint a new one before calling `getMe`.

### What needs to change

**1. Store the access token and attach it to requests:**

```js
// auth.slice.js
setAccessToken(state, action) { state.accessToken = action.payload; }
```

```js
// use.auth.js
const data = await login({ email, password });
dispatch(setUser(data.user));
dispatch(setAccessToken(data.accessToken));
```

```js
// auth.api.js — attach header dynamically
api.interceptors.request.use((config) => {
   const token = store.getState().auth.accessToken;
   if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
});
```

(You'll need to import your `store` here, or pass the token in some other way that avoids a circular import.)

---

### PROTECTED ROUTES - User Persitance on reload and refresh

cd frontend\src\features\auth\components\Protected.jsx

Know at time of hydration - Loading state is always true
Protected demands children
So Protected component banane ke baad - useSelector() se state read karo.
Then, Dashboard component ko Protected component ke ander wrap kardo.

---

### Implementing Socket IO

- first httpServer initialized karte hain using `npm i socket.io` - at backend - server.socket.js and server.js file setup

- then user aur socket ko (i.e frontend & backend ko) connect karte hain using `npm i socket.io-client` - at frontend - service/chat.socket.io and hooks/useChat.js file setup. Then Dashboard/home pe hydrate kardo

---

### AI Service - AI integration

- Create a chat Router

- Create a service folder/`ai.service.js` - import AI and tools

- create sendMessage API - route/controller ⇨ user will send a msg as an input and AI will read that input and generate a txt based output in response.

In-Depth sendMessage_API Flow ⇨ From chat creation to user & ai chatting:
   - request body mein message, chat id bhejenge
   - fir ye title aur chat to null honge shuru mein
   - check lagate agar chatId nahi hai to create karo title aur chat ko - chat aur title ko db mein save karo in chatModel.
   - Then messageModel mein - user ka msg db mei create karke save karenge
   - Fir messageModel mein - chat ki id ke basis pe messages find karenge.
   - messages agar mil gye to ai ko chat response ke liye de denge.
   - Then messageModel mein - ai ka msg response db mein create karke save karenge.


- An important distinction is to be noted:
Remember this:
model.invoke(...) → expects messages directly
agent.invoke({...}) → typically expects an object/state containing messages

Otherwise there would be an error you probably encounter:
   - promptValue.toChatMessages is not a function

And
When should you go for agent.invoke()?
An agent becomes valuable when you need things like:

User
 ↓
Agent
 ├── decide whether to call a tool
 ├── call database/search/calculator/etc.
 ├── inspect tool result
 ├── reason about result
 └── produce final AI response

 ```
export async function generateChatResponse(messages) {
   const chatMessages = messages.map((msg) => {
      if (msg.role === "user") {
         return new HumanMessage(msg.content);
      }

      if (msg.role === "ai" || msg.role === "assistant") {
         return new AIMessage(msg.content);
      }

      throw new Error(`Unsupported message role: ${msg.role}`);
   });

   const response = await agent.invoke({
      messages: chatMessages,
   });

   const lastMessage =
      response.messages[response.messages.length - 1];

   return lastMessage;
}

 ```


 ```
export async function generateChatResponse(messages) {
   const chatMessages = messages.map((msg) => {
      if (msg.role === "user") {
         return new HumanMessage(msg.content);
      }

      if (msg.role === "ai" || msg.role === "assistant") {
         return new AIMessage(msg.content);
      }

      throw new Error(`Unsupported message role: ${msg.role}`);
   });

   const response = await groqModel.invoke(chatMessages);

   const updatedMessages = [...chatMessages, response];

   return updatedMessages[updatedMessages.length - 1];
}

 ```