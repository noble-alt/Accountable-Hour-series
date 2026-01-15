document.addEventListener("DOMContentLoaded", () => {
    const adminLoginForm = document.getElementById("admin-login-form");
    const adminLogin = document.getElementById("admin-login");
    const adminDashboard = document.getElementById("admin-dashboard");
    const totalUsers = document.getElementById("total-users");
    const totalPosts = document.getElementById("total-posts");

    let token = null;

    adminLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("admin-username").value;
        const password = document.getElementById("admin-password").value;

        const response = await fetch("/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            localStorage.setItem('adminToken', token);
            adminLogin.style.display = "none";
            adminDashboard.style.display = "block";
            fetchStats();
        } else {
            alert("Invalid credentials");
        }
    });

    const fetchStats = async () => {
        if (!token) {
            token = localStorage.getItem('adminToken');
        }
        if (!token) {
            console.error('No token found');
            return;
        }

        const usersResponse = await fetch("/users", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const users = await usersResponse.json();
        totalUsers.textContent = users.length;

        const postsResponse = await fetch("/posts", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const posts = await postsResponse.json();
        totalPosts.textContent = posts.length;
    };
});
