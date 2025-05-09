import React, { useEffect } from "react";
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
  const { vid } = useParams();
  const dispatch = useDispatch();
  const vids = useSelector((state) => state.videoreducer);
  const currentuser = useSelector((state) => state.currentuserreducer);

  const vv = vids?.data ? vids.data.filter((q) => q._id === vid)[0] : null;
  // console.log(vv);
  const handleviews = () => {
    dispatch(viewvideo({ id: vid }));
  };

  const handlehistory = () => {
    dispatch(
      addtohistory({
        videoid: vid,
        viewer: currentuser?.result._id,
      })
    );
  };

  useEffect(() => {
    if (currentuser) {
      handlehistory();
    }
    handleviews();
  }, [dispatch, vid, currentuser]);

  // If no video is found or video data is incomplete, return a loading/error message
  if (!vv || !vv?.filepath) {
    return <div>Error: Video data is incomplete or unavailable.</div>;
  }

  // Construct video URL with fixed path
  const videoUrl = `http://localhost:5000/uploads/${vv?.filepath.replace(/\\/g, "/")}`;
  // Debug logs
//   console.log("Vid:",vid)
//   console.log("Redux currentuser:", currentuser);
//   console.log("Passed user to VideoPlayer:", currentuser?.result);


  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
          {/* Pass the video URL to the VideoPlayer */}
          <VideoPlayer videoId={vid} user={currentuser?.result} />

          <div className="video_details_videoPage">
            <div className="video_btns_title_VideoPage_cont">
              <p className="video_title_VideoPage">{vv?.videotitle}</p>
              <div className="views_date_btns_VideoPage">
                <div className="views_videoPage">
                  {vv?.views} views <div className="dot"></div>{" "}
                  {moment(vv?.createdat).fromNow()}
                </div>
                <Likewatchlatersavebtns vv={vv} vid={vid} />
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
