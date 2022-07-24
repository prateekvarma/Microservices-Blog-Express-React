import axios from "axios";
import React, { useState, useEffect } from "react";

const PostList = () => {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");
    setPosts(res.data);
  };

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div className="card" key={post.id}>
        <div className="card-body">
          <h3>{post.title}</h3>
        </div>
      </div>
    );
  });

  return <div>{renderedPosts}</div>;
};

export default PostList;
