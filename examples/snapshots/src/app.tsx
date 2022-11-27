import { server } from "./models/ServerSnapshot";
import { Body } from "@lizzi/template";
import { TwitterApp } from "./components/TwitterApp";

import "./app.css";
import { AppState } from "./models/AppState";

const appState = new AppState();

server.setValues(appState, {
  posts: [
    {
      id: 1,
      title: "Title",
      post: "post",
      author_id: 1,
      comments: [
        { id: 1, comment: "my comment", post_id: 1, author_id: 1 },
        { id: 2, comment: "comment", post_id: 1, author_id: 2 },
      ],
    },
  ],
  users: [
    {
      id: 1,
      name: "Rahul",
      email: "rahul@hotmail.com",
    },
    {
      id: 2,
      name: "Stanislav",
      email: "liz2k@gmail.com",
    },
  ],
});

Body(<TwitterApp appState={appState} />);
