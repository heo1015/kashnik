const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));

let posts = [];

// 모든 게시글 가져오기
app.get("/api/posts", (req, res) => {
    res.json(posts);
});

// 게시글 작성하기
app.post("/api/posts", (req, res) => {
    const { title, content, password } = req.body;
    if (!password || password.length !== 4 || isNaN(password)) {
        return res.status(400).json({ message: "비밀번호는 4자리 숫자로 설정해주세요." });
    }
    const newPost = { id: posts.length + 1, title, content, password };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// 게시글 수정하기
app.put("/api/posts/:id", (req, res) => {
    const { id } = req.params;
    const { title, content, password } = req.body;

    const post = posts.find(p => p.id === parseInt(id));
    if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    if (post.password !== password) return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });

    post.title = title;
    post.content = content;
    res.json(post);
});

// 게시글 삭제하기
app.delete("/api/posts/:id", (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    if (postIndex === -1) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    if (posts[postIndex].password !== password) return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });

    posts.splice(postIndex, 1);
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
