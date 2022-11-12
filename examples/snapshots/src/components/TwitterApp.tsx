import { zzCompute } from "@lizzi/core";
import { appState } from "../models/AppState";

export function TwitterApp(){
    return <div>
        {appState.posts.map(post => <div>
            <div>
                {post.title}
            </div>
            <div>
                {post.post}
            </div>
            <div>
                Author: {zzCompute(() => post.author.value?.name.value)}
            </div>
            <div>
                Comments: 
                {post.comments.map(comment => <div>
                    <div>
                        {comment.comment}
                    </div>
                    <div>
                        {zzCompute(() => comment.author.value?.name.value)}
                    </div>
                </div>)}
            </div>
        </div>)}
    </div>;
}

