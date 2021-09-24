import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { dateCleaner, serverEndpoint } from '_helpers';

// TODO: Move the Photos and Posts pages into one component or have them do diffrent things
function Posts() {
  const [posts, setPosts] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [displayType, setDisplayType] = useState(1); // Should have ENUM
  const displayTypes = [
    {collumns: "auto auto auto", width: 400, height: 325},
    {collumns: "auto auto auto auto", width: 300, height: 225},
    {collumns: "auto auto auto auto auto", width: 200, height: 125},
  ]
  
  useEffect(() => {
    const user = JSON.parse(window.sessionStorage.getItem("user"));

    (async function getPhotos(user) {
      const postData = await axios.get(`https://${serverEndpoint}/posts/facebook/${user.user_id}`)
        .then(postData => postData)
        .catch(error => console.log(error)); // TODO: Implement error display for user
      setPosts(postData.data);
    })(user);
  }, []);

  // Toggles individual photo selection
  function toggleSelection(id) {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(item => item !== id));
    } else {
      setSelectedPosts(selectedPosts.concat([id]));
    }
  }

  // Toggles all photos
  function togglePhotos() {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id))
    }
  }

  function toggleSizes(e) {
    setDisplayType(e.target.value);
  }

  if (!posts) return <h3>Loading Your Facebook Posts</h3>;
  if (posts.length === 0) return <h3>You don't have any posts avalible</h3>;
  return (
    <div>
      <h3>All Post Photos Ever</h3>
      <button onClick={togglePhotos}>{selectedPosts.length === posts.length ? "Deselect All" : "Select All"}</button>
      <button value={2} onClick={toggleSizes}>Small</button>
      <button value={1} onClick={toggleSizes}>Medium</button>
      <button value={0} onClick={toggleSizes}>Large</button>
      <button onClick={() => {setShowMessage(showMessage ? false : true )}}>{showMessage ? "Hide Messages" : "Show Messages"}</button>
      <div style={{display: "grid", gridTemplateColumns: displayTypes[displayType].collumns, gridColumnGap: "10px", gridRowGap: "10px"}}>
        {posts.map(post =>
        <div
          key={post.post_id}
          onClick={() => toggleSelection(post.post_id)} 
          style={selectedPosts.includes(post.post_id) ? {border: "2px solid blue", borderRadius: "5px"} : {padding: "2px"}}>
          <img
            src={post.src_link}
            alt={post.message === "null" ? "No Caption Given" : post.message}
            width={displayTypes[displayType].width}
            height={displayTypes[displayType].height} />
            <div>
              Created on: {dateCleaner(post.created_at)}
              <br />
              {showMessage ? (post.message ? post.message : "No Message Given") : null}
            </div>
      </div>)}
      </div>
    </div>
  );
}

export { Posts };