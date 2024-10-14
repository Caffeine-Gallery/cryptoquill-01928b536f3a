import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  quill = new Quill('#editor', {
    theme: 'snow'
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const newPostForm = document.getElementById('newPostForm');
  const postForm = document.getElementById('postForm');

  newPostBtn.addEventListener('click', () => {
    newPostForm.style.display = 'block';
  });

  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const body = quill.root.innerHTML;

    await backend.createPost(title, body, author);
    newPostForm.style.display = 'none';
    postForm.reset();
    quill.setContents([]);
    await displayPosts();
  });

  await displayPosts();
});

async function displayPosts() {
  const postsSection = document.getElementById('posts');
  const posts = await backend.getPosts();
  
  postsSection.innerHTML = posts.map(post => `
    <article>
      <h2>${post.title}</h2>
      <p class="author">By ${post.author}</p>
      <p class="date">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
      <div class="content">${post.body}</div>
    </article>
  `).join('');
}
