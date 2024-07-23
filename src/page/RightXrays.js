import React, { Component } from "react";
import {
  getMyImage,
  getNewImage,
  saveImage,
  getImage,
  DeleteImage,
  DeleteCurrentImage,
  currentUser,
} from "../Firebase";
import LeftZone from "../assets/Left Hip.png";
import RightZone from "../assets/Right Hip.png";
import Zoom from "../component/Zoom";
import { CheckBox } from "../component/CheckBox";
import { Note } from "../component/Note";

import NotAvail from "../assets/img/rightnotavail.PNG";
import getImageFromObject from "../getImage";

// import SwipeableViews from 'react-swipeable-views';

export const rates = [
  { name: "Normal/Slight", value: 1 },
  { name: "Moderate", value: 2 },
  { name: "NES", value: 3 },
  { name: "End Stage", value: 4 },
  { name: "Replaced", value: 5 },
];

class RightXrays extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSide: null,
      FrogEval: null,
      left: null,
      EvalType: null,
      index: 0,
      FrogBase64: null,
      HipBase64: null,
    };
  }

  setComponentBack = () => {
    console.log("setback");
    let xray = this.props.xray;
    if (xray && xray.value) {
      let left = null;
      let FrogEval = false;
      let EvalType = "Hip";

      left = false;
      if (xray.value.RightFrog == true) {
        FrogEval = true;
      }

      this.setState({ xray, FrogEval, left, EvalType });
    } else {
      this.setState({ xray, loading: false });
    }
  };

  setFrogImage = async (xray) => {
    const FrogBase64 = await getImageFromObject(
      xray.value.RightFrogImage.imageUrl
    );
    this.setState({ FrogBase64 });
  };
  setHipImage = async (xray) => {
    const HipBase64 = await getImageFromObject(xray.value.HipImage.imageUrl);
    this.setState({ HipBase64 });
  };

  setComponent = async () => {
    let xray = this.props.xray;
    console.log("xray", xray);

    if (xray && xray.value) {
      let left = null;
      let FrogEval = false;
      let EvalType = "Hip";
      const promises = [];

      left = false;
      console.log("xray.value.RightFrog", xray.value.RightFrog);
      if (xray.value.RightFrog) {
        FrogEval = true;
        this.setFrogImage(xray);
      }

      if (xray.value.Hip) {
        this.setHipImage(xray);
        // promises.push(
        //     getImageFromObject(xray.value.HipImage.imageUrl).then(base64 => {
        //         xray.value.HipImage.imageUrl.base64 = base64;
        //     })
        // );
      }

      await Promise.all(promises);

      this.setState({ xray, FrogEval, left, EvalType });
    } else {
      this.setState({ xray, loading: false });
    }
  };
  componentWillMount() {
    console.log("in right");

    this.setComponent();
  }

  toggleLateral = () => {
    if (this.state.EvalType === "Lateral") {
      return;
    }

    this.setState({ EvalType: "Lateral", left: true, index: 1 });
  };
  toggleHip = () => {
    if (this.state.EvalType === "Hip") {
      return;
    }

    this.setState({ EvalType: "Hip", left: false, index: 0 });
  };

  prevImage = async () => {
    let xray = this.state.xray;
    if (xray.value.isError && xray.value.comment === "") {
      alert("Please add note about error");
      return;
    }

    await this.saveChanges();
    this.props.prevImage();
    // this.setComponentBack();
  };

  saveChanges = async () => {
    let xray = this.state.xray;
    this.setState({ loading: true });
    xray.value.rightStatus = 3;
    if (xray.value.leftStatus == 3) {
      xray.value.status = 3;
    }
    xray.value.evaluatedOn = new Date().toJSON();
    xray.value.evaluator = currentUser().uid;

    xray.value.userName =
      currentUser().email.toString() || currentUser().userName.toString();

    await saveImage(xray.key, xray.value);
    this.setState({ loading: false });
  };

  handleCheck = (checked, field, value) => {
    let xray = this.state.xray;
    const activeTable =
      this.state.EvalType === "Hip" ? "RightHipImage" : "RightFrogImage";

    if (xray.value[activeTable].zone1 == 5) {
      xray.value[activeTable].zone1 = "";
      xray.value[activeTable].zone2 = "";
      xray.value[activeTable].zone3 = "";
    }

    xray.value[activeTable][field] = checked ? value : null;
    this.setState({ xray });
  };

  handleCheckAll = (checked, value) => {
    let { xray } = this.state;
    const activeTable =
      this.state.EvalType === "Hip" ? "RightHipImage" : "RightFrogImage";
    xray.value[activeTable].zone1 = checked ? value : null;
    xray.value[activeTable].zone2 = checked ? value : null;
    xray.value[activeTable].zone3 = checked ? value : null;
    this.setState({ xray });
  };

  nextImage = async () => {
    let xray = this.state.xray;
    if (xray.value.isError && xray.value.comment === "") {
      alert("Please add note about error");
      return;
    }

    // if(xray.value.leftStatus===1)
    // {
    //     xray.value.leftStatus = 2;
    // }

    await this.saveChanges();
    this.props.toggle(this.state.xray);
    return;
  };
  render() {
    const xray = this.state.xray;
    const lB = this.state.left;
    const global = this;
    const activeTable =
      this.state.EvalType === "Hip" ? "RightHipImage" : "RightFrogImage";
    function Table() {
      return xray.value.Hip == true ? (
        <table className="tablet">
          <tbody>
            <tr>
              <td style={{ verticalAlign: "bottom" }}>
                <div
                  style={{
                    borderLeft: "4px solid #8fdf5d",
                    borderRight: "4px solid #8fdf5d",
                    width: "calc(100% - 0px)",
                    height: "69px",
                    lineHeight: "61px",
                    marginBottom: "0px",
                    verticalAlign: "bottom",
                    display: "inline-block",
                    borderTop: "4px solid #8fdf5d",
                    borderBottom: "4px solid #8fdf5d",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Right Hip
                  </span>
                </div>
              </td>
              <td
                colspan="3"
                style={{
                  borderRight:
                    global.state.FrogEval === true ? "1px solid white" : null,
                  verticalAlign: "bottom",
                }}
              >
                <div
                  style={{
                    width: "calc(50%)",
                    background: !lB ? "#8fdf5d" : "",
                    height: "69px",
                    textAlign: "center",
                    marginBottom: "0px",
                    verticalAlign: "bottom",
                    display: "inline-block",
                    borderTop: "1px solid white",
                    borderRight: "1px solid white",
                    borderBottom: lB ? "1px solid white" : null,
                  }}
                >
                  <a
                    className="button-confirm w-button"
                    onClick={global.toggleHip}
                    style={{
                      borderWidth: !lB ? 3 : 0,
                      borderColor: !lB ? "white" : "none",
                      borderStyle: !lB ? "solid" : "none",
                    }}
                  >
                    Ap Hip
                  </a>
                </div>

                {global.state.FrogEval === true ? (
                  <div
                    style={{
                      width: "50%",
                      background: lB ? "#8fdf5d" : "",
                      height: "69px",
                      marginBottom: "0px",
                      verticalAlign: "bottom",
                      display: "inline-block",
                      borderBottom: !lB ? "1px solid white" : null,
                      borderTop: "1px solid white",
                    }}
                  >
                    <a
                      className="button-confirm w-button"
                      onClick={global.toggleLateral}
                      style={{
                        marginLeft: 30,
                        borderWidth: lB ? 3 : 0,
                        borderColor: lB ? "white" : "none",
                        borderStyle: lB ? "solid" : "none",
                      }}
                    >
                      Lateral Hip
                    </a>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "50%",
                      display: "inline-block",
                      height: "57px",
                      marginBottom: "0px",
                      verticalAlign: "bottom",
                      borderBottom: "1px solid white",
                    }}
                  ></div>
                )}
              </td>
            </tr>

            <tr style={{ borderLeft: "1px solid white" }}>
              <td style={{ verticalAlign: "bottom" }}></td>
              <td>
                <p className="table-text c">Zone 1</p>
              </td>
              <td>
                <p className="table-text c">Zone 2</p>
              </td>
              <td style={{ borderRight: "1px solid white" }}>
                <p className="table-text c">Zone 3</p>
              </td>
            </tr>
            {rates.map((i) => (
              <tr key={i.value} style={{ borderLeft: "1px solid white" }}>
                <td style={{ verticalAlign: "bottom" }}>
                  <p className="table-text">{i.name}</p>
                </td>

                {i.value < 5 ? (
                  <td>
                    <CheckBox
                      checked={xray.value[activeTable].zone1 === i.value}
                      onChange={(checked) => {
                        global.handleCheck(checked, "zone1", i.value);
                      }}
                    />
                  </td>
                ) : (
                  // <td><span style={{display:'inline-block',borderBottom:'1px white solid',height:'41px',width:'100%',verticalAlign:"bottom"}}> </span></td>
                  <td>
                    <CheckBox
                      checked={xray.value[activeTable].zone1 === i.value}
                      onChange={(checked) => {
                        global.handleCheckAll(checked, i.value);
                      }}
                    />
                  </td>
                )}
                {i.value < 5 ? (
                  <td>
                    <CheckBox
                      checked={xray.value[activeTable].zone2 === i.value}
                      onChange={(checked) => {
                        global.handleCheck(checked, "zone2", i.value);
                      }}
                    />
                  </td>
                ) : (
                  <td style={{ borderBottom: "1px white solid" }}>
                    <a
                      className="view-report button-7 w-button"
                      onClick={() => {
                        xray.value.isError = true;
                        global.setState({ addNote: true, xray });
                      }}
                    >
                      X-ray Error
                    </a>
                  </td>
                )}
                {i.value < 5 ? (
                  <td style={{ borderRight: "1px solid white" }}>
                    <CheckBox
                      checked={xray.value[activeTable].zone3 === i.value}
                      onChange={(checked) => {
                        global.handleCheck(checked, "zone3", i.value);
                      }}
                    />
                  </td>
                ) : (
                  <td
                    style={{
                      borderRight: "1px solid white",
                      borderBottom: "1px solid white",
                    }}
                  >
                    <a
                      href="#"
                      className="view-report button-7 green w-button"
                      onClick={() => global.setState({ addNote: true })}
                    >
                      Add Note
                    </a>
                    {/* {i.value===3 && (<a href="#" className="view-report button-7 red w-button"
                                            onClick={this.delete}>Delete</a>)} */}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null;
    }

    if (xray != null)
      return (
        <div style={{ height: "calc(100vh - 35px)" }}>
          <div className="xray-wrapper">
            {xray.value.Hip === true ? (
              <span className="xray-image-wrapper">
                <Zoom
                  src={this.state.HipBase64}
                  active={this.state.EvalType === "Hip"}
                  style={{ width: "100%" }}
                />
              </span>
            ) : null}

            {this.state.FrogEval === true ? (
              <span className="xray-image-wrapper">
                <Zoom
                  src={this.state.FrogBase64}
                  active={this.state.EvalType === "Lateral"}
                  style={{ width: "100%" }}
                />
              </span>
            ) : (
              <span
                style={{
                  width: "31%",
                  display: "inline-block",
                  marginRight: "2%",
                  verticalAlign: "top",
                }}
              >
                <img
                  src={NotAvail}
                  style={{ maxWidth: "100%", maxHeight: "273px" }}
                />
              </span>
            )}
          </div>

          <div className="table-wrapper">
            <div style={{ display: "inline-block", width: "74%" }}>
              <Table />
            </div>
            <span className="zone-image-div">
              <img
                src={RightZone}
                alt="ZONES"
                style={{
                  width: "100%",
                  height: 220,
                  borderWidth: 3,
                  borderColor: "white",
                  borderStyle: "solid",
                }}
              />
            </span>
          </div>

          <a
            className="button-confirm w-button"
            onClick={this.prevImage}
            style={{ position: "fixed", left: 50, bottom: 20 }}
          >
            Previous Patient
          </a>
          <a
            className="button-confirm w-button"
            onClick={this.nextImage}
            style={{
              position: "fixed",
              left: "auto",
              right: 50,
              bottom: 20,
              fontWeight: "bold",
            }}
          >
            {" "}
            Evaluate Left Hip{" "}
          </a>

          <Note
            show={this.state.addNote}
            EvalType={
              this.state.EvalType === "Hip"
                ? this.state.EvalType
                : "Right Lateral Hip"
            }
            notes={
              this.state.EvalType === "Hip"
                ? [xray.value.rightNotes, xray.value.leftNotes]
                : this.state.EvalType === "Lateral"
                ? xray.value.RightFrogImage.comment
                : ""
            }
            onSubmit={(value) => {
              if (this.state.EvalType === "Hip") {
                xray.value.rightNotes = value[0];
                xray.value.leftNotes = value[1];
              } else if (this.state.EvalType === "Lateral") {
                xray.value.RightFrogImage.comment = value;
              }

              this.setState({ addNote: false, xray });
            }}
            onCancel={() => {
              xray.value.isError = false;
              this.setState({ addNote: false, xray });
            }}
          />
        </div>
      );
    else return <div></div>;
  }
}

export default RightXrays;
