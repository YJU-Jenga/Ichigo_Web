import Slider from "react-slick";
import "./Slick.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Slick() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <div className="container ">
      <Slider {...settings}>
        <div>
          <img src="img/music_gosung.jpg" alt="" />
        </div>
        <div>
          <img src="img/sad_gosung.jpg" alt="" />
        </div>
        <div>
          <img src="img/sorry_gosung.jpg" alt="" />
        </div>
        <div>
          <img src="img/sugoi_gosung.jpg" alt="" />
        </div>
      </Slider>
    </div>
  );
}
export default Slick;