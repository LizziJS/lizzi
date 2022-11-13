import { zzCompute } from "@lizzi/core";
import { appState } from "../models/AppState";

export function TwitterApp() {
  return (
    <div class="m-4">
      {appState.posts.map((post) => (
        <>
          <div class="shadow rounded p-4">
            <div class="text-lg font-bold">{post.title}</div>
            <div class="text-sm">{post.post}</div>
            <div class="text-xs">
              Author: {zzCompute(() => post.author.value?.name.value)}
            </div>
          </div>
          <div class="shadow rounded p-4 mt-4">
            Comments:
            {post.comments.map((comment) => (
              <div>
                <div class="text-sm">{comment.comment}</div>
                <div class="text-xs">
                  Author: {zzCompute(() => comment.author.value?.name.value)}
                </div>
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}
