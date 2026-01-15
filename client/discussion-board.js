document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.querySelector(".post-container");
    const newPostForm = document.getElementById("new-post-form");
    let token = localStorage.getItem('adminToken');

    const fetchPosts = async () => {
        if (!token) {
            console.error('No token found');
            return;
        }
        const response = await fetch("/posts", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const posts = await response.json();
        postContainer.innerHTML = "";
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="like-button" data-id="${post.id}">Like (${post.likes})</button>
                <button class="share-button" data-id="${post.id}">Share</button>
                <div class="comment-section">
                    <h4>Comments</h4>
                    <div class="comments">
                        ${post.comments.map(comment => `<p>${comment}</p>`).join("")}
                    </div>
                    <form class="comment-form" data-id="${post.id}">
                        <input type="text" placeholder="Add a comment" required>
                        <button type="submit">Comment</button>
                    </form>
                </div>
            `;
            postContainer.appendChild(postElement);
        });
    };

    newPostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("post-title").value;
        const content = document.getElementById("post-content").value;
        await fetch("/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content }),
        });
        fetchPosts();
    });

    postContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("like-button")) {
            const postId = e.target.dataset.id;
            await fetch(`/posts/${postId}/like`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            fetchPosts();
        } else if (e.target.classList.contains("share-button")) {
            const postId = e.target.dataset.id;
            const postUrl = `${window.location.origin}/discussion-board.html#post-${postId}`;
            navigator.clipboard.writeText(postUrl).then(() => {
                alert("Post link copied to clipboard!");
            });
        }
    });

    postContainer.addEventListener("submit", async (e) => {
        if (e.target.classList.contains("comment-form")) {
            e.preventDefault();
            const postId = e.target.dataset.id;
            const comment = e.target.querySelector("input").value;
            await fetch(`/posts/${postId}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ comment }),
            });
            fetchPosts();
        }
    });

    fetchPosts();
});
