// 게시글 목록을 서버에서 가져와 렌더링하는 함수
async function loadPosts() {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    const postList = document.getElementById("postList");

    postList.innerHTML = posts.map(post => `
        <li>
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button onclick="editPost(${post.id})">수정</button>
            <button onclick="deletePost(${post.id})">삭제</button>
        </li>
    `).join("");
}

// 게시글을 생성하는 함수
async function createPost() {
    const title = prompt("제목을 입력하세요:");
    const content = prompt("내용을 입력하세요:");
    const password = prompt("비밀번호 (4자리 숫자)를 설정하세요:");

    if (password.length !== 4 || isNaN(password)) {
        alert("비밀번호는 4자리 숫자로 입력해주세요.");
        return;
    }

    await fetch("/api/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content, password })
    });

    loadPosts();
}

// 게시글 수정 함수
async function editPost(id) {
    const title = prompt("새 제목을 입력하세요:");
    const content = prompt("새 내용을 입력하세요:");
    const password = prompt("비밀번호를 입력하세요:");

    const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content, password })
    });

    if (response.ok) {
        alert("게시글이 수정되었습니다.");
    } else {
        const error = await response.json();
        alert(error.message);
    }

    loadPosts();
}

// 게시글 삭제 함수
async function deletePost(id) {
    const password = prompt("비밀번호를 입력하세요:");

    const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
    });

    if (response.ok) {
        alert("게시글이 삭제되었습니다.");
    } else {
        const error = await response.json();
        alert(error.message);
    }

    loadPosts();
}

// 페이지 로드 시 게시글을 불러옴
document.addEventListener("DOMContentLoaded", loadPosts);
