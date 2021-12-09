//type, id, datetime_utc, title, popularity, url
const Event = ({ type, id, datetime_utc, title, popularity, url }) => {
  return (
    <article className="event">
      <h3>{title}</h3>
      <h4>Type: {type}</h4>
      <h5>popularity:{popularity}*</h5>
      <h5>{datetime_utc}</h5>
      <a href={url}>Link to show</a>
    </article>
  );
};

export default Event;
