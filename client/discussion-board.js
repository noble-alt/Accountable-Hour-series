document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');

    async function fetchPosts() {
        try {
            const response = await fetch(`${getApiBase()}/posts`);
            const posts = await response.json();
            postsContainer.innerHTML = posts.map(post => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>By ${post.author} on ${new Date(post.date).toLocaleDateString()}</small>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to post');
                return;
            }

            const formData = new FormData(postForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${getApiBase()}/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    postForm.reset();
                    fetchPosts();
                } else {
                    alert('Failed to create post');
                }
            } catch (error) {
                console.error('Error creating post:', error);
            }
        });
    }

    fetchPosts();
});

function getApiBase() {
    const { protocol, hostname, port } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        if (port !== '3000' && port !== '') {
            return `${protocol}//${hostname}:3000/api`;
        }
    }
    return '/api';
}
