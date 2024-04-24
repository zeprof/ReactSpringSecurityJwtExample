import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import './PageLayout.css'

function PageLayout () {
  return (
    <div id="pagelayout" className="pageLayout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );

}
export default PageLayout;