import { useNavigate } from "react-router-dom";

const BackLink = () => {
  const navigate = useNavigate();

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
      className="global-back-btn"
    >
      ← Back
    </a>
  );
};

export default BackLink;
