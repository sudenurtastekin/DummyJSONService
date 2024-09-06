import { useEffect, useState, useRef } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState({ category: '', searchQuery: '' });
  const dialogRef = useRef(null);

  async function getData() {
    const skip = (page - 1) * limit;
    const fetchUrl = `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`;

    const data = await fetch(fetchUrl).then((res) => res.json());

    const postsWithComments = await Promise.all(
      data.posts.map(async (post) => {
        const commentUrl = `https://dummyjson.com/posts/${post.id}/comments`;
        const commentsData = await fetch(commentUrl).then((res) => res.json());
        return { ...post, commentCount: commentsData.comments.length }; 
      })
    );

    setPosts(postsWithComments);
    setTotal(data.total); 
    applyFilters(postsWithComments);
  }

  useEffect(() => {
    getData();
  }, [page]);

  useEffect(() => {
    applyFilters(posts);
  }, [filter, posts]);

  function applyFilters(posts) {
    let filtered = posts;

    if (filter.category) {
      filtered = filtered.filter((post) => post.category === filter.category);
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setPage(1);
  }

  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  const pageCount = Math.ceil(total / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if (page + 1 <= pageCount) {
      setPage(page + 1);
    }
  }

  async function openModal(post) {
    setSelectedPost(post);
    const commentUrl = `https://dummyjson.com/posts/${post.id}/comments`;
    const commentsData = await fetch(commentUrl).then((res) => res.json());
    setComments(commentsData.comments);

    if (dialogRef.current) {
      dialogRef.current.showModal(); 
    }
  }

  function closeModal() {
    setSelectedPost(null);
    setComments([]);
    if (dialogRef.current) {
      dialogRef.current.close(); 
    }
  }

  return (
    <>
      <div className="postContainer">
        <div className="postHeader">
          <Filter onFilterChange={handleFilterChange} />
        </div>
        <div className="postItems">
          {filteredPosts.map((post) => (
            <div className="postItem" key={post.id} onClick={() => openModal(post)}>
              <h4>{post.title}</h4>
              <div>
                <span>Likes: {post.reactions.likes}</span> | 
                <span> Dislikes: {post.reactions.dislikes}</span> <br />
                <span> Comments: {post.commentCount}</span> 
              </div>
            </div>
          ))}
        </div>
      </div>

      {pageCount > 0 && (
        <ul className="PostPagination">
          <li><a href="#" onClick={handlePrevPage}>&lt;</a></li>
          {Array.from({ length: pageCount }, (v, i) => i + 1).map((x) => (
            <li key={x}>
              <a
                href="#"
                className={page === x ? 'activePage' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  changePage(x);
                }}
              >
                {x}
              </a>
            </li>
          ))}
          <li><a href="#" onClick={handleNextPage}>&gt;</a></li>
        </ul>
      )}

      <dialog ref={dialogRef} className="modalDialog">
        {selectedPost && (
          <div>
            <button className="closeButton" onClick={closeModal}>X</button>
            <h3>{selectedPost.title}</h3>
            <p>{selectedPost.body}</p>
            <div className="tags">
              {selectedPost.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag} 
                </span>
              ))}
            </div>
            <div className="comments">
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p><strong>{comment.user.username}:</strong> {comment.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function Filter({ onFilterChange }) {
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ category, searchQuery });
  };

  return (
    <div className="post-filter-container">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={handleFilterChange}
      />
      <button onClick={handleFilterChange} className='filterBtn'>Apply Filters</button>
    </div>
  );
}

export default App;
