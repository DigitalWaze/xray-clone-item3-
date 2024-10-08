import React, { Component } from "react";
import {
  getMyImage,
  getImage,
  getNewImage,
  checkIfCompleted,
  neutralizeAllImages,
} from "../Firebase";
import { Loader } from "../component/Loader";
import RightXrays from "./RightXrays";
import LeftXrays from "./LeftXrays";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { view: null, loading: true, xray: { key: "", value: {} } };
  }

  prevImage = async () => {
    this.setState({ view: null, loading: true });
    let xray = this.state.xray;
    let oldKey = xray.key;
    let new_xray = null;
    let view = null;

    if (xray && xray.value && xray.value.backImage) {
      new_xray = await getImage(xray.value.backImage);
      if (new_xray && new_xray.value) {
        new_xray.value.nextImage = xray.key;
      }
    } else new_xray = null;
    if (new_xray && new_xray.value) {
      if (new_xray.value.Hip) {
        // if(new_xray.value.RightFrog===true || new_xray.value.LeftFrog===true)
        // {
        //     view="HipFrog"
        // }

        // else
        // {
        //     view="HipOnly"
        // }
        if (new_xray.value.leftStatus?.toString() === "1") {
          view = "Left";
        } else if (new_xray.value.rightStatus?.toString() === "1") {
          view = "Right";
        } else view = "Left";
      } else {
        // console.log('Image Deleted')
        if (oldKey === new_xray.value.nextImage) {
          alert("No Back Image Found");
          new_xray = null;
        }
        // this.nextImageAfterDeleted(xray);
      }
    }

    this.setState({ xray: new_xray, view, loading: false });
  };

  nextImage = async () => {
    this.setState({ view: null, loading: true });
    let xray = this.state.xray;
    let new_xray = null;
    let view = null;
    if (xray && xray.value && xray.value.nextImage) {
      // console.log('nextImage')
      new_xray = await getImage(xray.value.nextImage);
      if (new_xray && new_xray.value) {
        new_xray.value.backImage = xray.key;
      }
    } else {
      // console.log('newImage')
      new_xray = await getNewImage(xray.key);
      if (new_xray && new_xray.value) {
        new_xray.value.backImage = xray.key;
        xray.value.nextImage = new_xray.key;
      }
    }

    // console.log(new_xray)

    if (new_xray && new_xray.value) {
      // if(new_xray.value.RightFrog===true || new_xray.value.LeftFrog===true)
      // {
      //     view="HipFrog"
      // }

      // else
      // {
      //     view="HipOnly"
      // }
      if (new_xray.value.rightStatus == 1) {
        view = "Right";
      } else if (new_xray.value.leftStatus == 1) {
        view = "Left";
      } else view = "Right";
      // console.log(view)
    }

    this.setState({ view, xray: new_xray, view, loading: false });
  };

  toggleLeft = (xray) => {
    this.setState({ view: "Right", xray });
  };

  toggleRight = (xray) => {
    this.setState({ view: "Left", xray });
  };

  async componentDidMount() {
    // neutralizeAllImages();
    let oldkey = localStorage.getItem("oldKey") || "";
    let xray = null;
    if (oldkey) {
      xray = await getMyImage(oldkey);
    } else xray = await getMyImage();
    if (xray == null || xray.value == null) {
      this.LoadXray(oldkey);
    } else {
      this.setView(xray);
    }
  }

  setView = (xray) => {
    // console.log("xray.value.rightStatus", xray.value.rightStatus);
    // console.log("xray.value.rightStatus", xray.value.leftStatus);
    let view = null;

    if (xray.value.rightStatus?.toString() === "1") {
      view = "Right";
      this.setState({ view, xray, loading: false });
    } else if (xray.value.leftStatus?.toString() === "1") {
      view = "Left";
      this.setState({ view, xray, loading: false });
    } else {
      this.LoadXray(xray?.key);
    }
  };

  LoadXray = async (oldkey) => {
    console.log("new", oldkey);
    let xray = await getNewImage(oldkey);

    if (xray && xray.value) {
      if (oldkey && !!xray.value.backImage) {
        xray.value.backImage = oldkey;
      }
      if (xray.status?.toString() === "3") {
        this.LoadXray(xray?.key);
      } else {
        this.setView(xray);
      }
    } else {
      console.log("No new Xray");
      this.setState({ view: null, xray: null, loading: false });
    }
  };
  render() {
    const xray = this.state.xray;
    if (xray == null || xray.value == null) {
      return (
        <section>
          {this.props.isAdmin && (
            <button
              className="button-confirm w-button"
              onClick={() => {
                this.props.history.push("/Manage");
              }}
              style={{
                position: "fixed",
                top: 20,
                right: 50,
                left: "auto",
                bottom: "auto",
              }}
            >
              {" "}
              Upload
            </button>
          )}
          <h2>No Data Found</h2>
        </section>
      );
    }
    return (
      <div>
        {this.props.isAdmin && (
          <button
            className="button-confirm w-button"
            onClick={() => {
              this.props.history.push("/Manage");
            }}
            style={{
              position: "fixed",
              top: 20,
              right: 50,
              left: "auto",
              bottom: "auto",
            }}
          >
            {" "}
            Upload
          </button>
        )}
        <div className="columns-6 w-row">
          <div className="column-right-padding w-col w-col-7">
            <h3 className="heading-4">SBS X-ray Review</h3>
          </div>
          <div className="w-col w-col-5">
            <p className="small-paragraph">
              Patient Reference Number:{" "}
              {this.state.xray ? this.state.xray.value.RefNum : null}
            </p>
          </div>
        </div>

        {this.state.loading === true ? (
          <Loader loading={true} />
        ) : this.state.view === "Right" ? (
          <RightXrays
            toggle={() => this.toggleRight(xray)}
            xray={this.state.xray}
            nextImage={this.nextImage}
            prevImage={this.prevImage}
          />
        ) : this.state.view === "Left" ? (
          <LeftXrays
            toggle={() => this.toggleLeft(xray)}
            xray={this.state.xray}
            nextImage={this.nextImage}
            prevImage={this.prevImage}
          />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default Home;
