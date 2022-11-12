import { Post, Posts } from "./Post";
import { server } from "./ServerSnapshot";
import { User, Users } from "./User";

export class AppState{
    @server.arr(Post) readonly posts = new Posts();
    @server.arr(User) readonly users = new Users();
}

export const appState = new AppState;

