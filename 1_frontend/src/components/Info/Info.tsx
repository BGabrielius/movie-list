import styled from "./Info.module.css";

const Info = () => {
  return (
    <div className={styled.container}>
      <span>
        <p>
          To add movies to your list, simply type the title of the movie into
          the search bar. Select the movie. Click on the "heart" icon. That's
          it!
        </p>
        <p>
          To remove movies from your list, simply navigate into your own list
          and click the same "heart" icon of the movie that you want to remove.
          Done!
        </p>
      </span>
      <p>
        <b> Note:</b> You can add movies from anywhere besides your own list.
        You can only remove movies while within your own list.
      </p>
    </div>
  );
};

export default Info;
