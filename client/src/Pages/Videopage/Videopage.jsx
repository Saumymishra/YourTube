import React, { useEffect, useState } from "react";
import "./Videopage.css";
import moment from "moment";
import Likewatchlatersavebtns from "./Likewatchlatersavebtns";
import { useParams, Link } from "react-router-dom";
import Comment from "../../Component/Comment/Comment";
import { viewvideo } from "../../action/video";
import { addtohistory } from "../../action/history";
import { useSelector, useDispatch } from "react-redux";
import VideoPlayer from "../../Component/Video/VideoPlayer";

const Videopage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const vids = useSelector((state) => state.videoreducer);
  const currentuser = useSelector((state) => state.currentuserreducer);

  // Local state for user object that can be updated (e.g., premium status)
  const [user, setUser] = useState(currentuser?.result);

  useEffect(() => {
    // Update local user state if Redux currentuser changes
    setUser(currentuser?.result);
  }, [currentuser]);

  const vv = vids?.data ? vids.data.find((q) => q._id === videoId) : null;

  const handleviews = () => {
    dispatch(viewvideo({ id: videoId }));
  };

  const handlehistory = () => {
    // console.log("vashu",currentuser?.result?._id);
    if (!currentuser?.result?._id) {
    console.log('User not logged in — history not saved.');
    return;
  }
    dispatch(
      addtohistory({
        videoid: videoId,
        viewer: currentuser?.result._id,
      })
    );
  };

  useEffect(() => {
    if (currentuser) {
      handlehistory();
    }
    handleviews();
  }, [dispatch, videoId, currentuser]);

  if (!vv || !vv?.filepath) {
    return <div>Error: Video data is incomplete or unavailable.</div>;
  }

  const videoUrl = `http://localhost:5000/uploads/qualities/${vv?.filepath.replace(/\\/g, "/")}`;

  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          <VideoPlayer videoId={videoId} user={user} setUser={setUser} />
          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage">{vv?.videotitle}</p>
              <div className="views_date_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.views} views <div className="dot"></div> {moment(vv?.createdat).fromNow()}
                </div>
                <Likewatchlatersavebtns vv={vv} vid={videoId} />
              </div>
            </div>
            <Link to={"/"} className="chanel_details_videoPage">
              <b className="chanel_logo_videoPage">
                <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
              </b>
              <p className="chanel_name_videoPage">{vv.uploader}</p>
            </Link>
            <div className="comments_VideoPage">
              <h2>
                <u>Comments</u>
              </h2>
              <Comment videoid={vv._id} />
            </div>
          </div>
        </div>
        <div className="moreVideoBar">More videos</div>
      </div>
    </div>
  );
};

export default Videopage;
