import classes from "./FeedImagePost.module.css";

const FeedImagePost = ({ photoPost }) => {
  return (
    <section className={classes.feedImagePost}>

      {photoPost && (
        <a href={photoPost} target="_blank" rel="noreferrer">
          <img src={photoPost} alt="photo_post" />
        </a>
      )}
      
    </section>
  );
};

export default FeedImagePost;
