import React from "react";
import { withRouter } from "react-router-dom";

class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
  }
  render() {
    return (
      <div
        className="navbar w-nav"
        onClick={() => this.setState({ menu: !this.state.menu })}
      >
        <div
          className={`menu-button w-nav-button ${
            this.state.menu ? "w--open" : ""
          }`}
        >
          <div className="icon w-icon-nav-menu"></div>
        </div>
        <div
          className={`w-nav-overlay ${
            this.state.menu ? "nav-menu-open" : "nav-menu-close"
          }`}
        >
          <nav
            role="navigation"
            className="nav-menu w-nav-menu w--nav-menu-open"
          >
            {/* <a href="#" className="nav-link w-nav-link w--nav-link-open">Right Knee Sample Patient</a>
                        <div className="neon-green-line tiny center"></div>
                        <a href="#" className="nav-link w-nav-link w--nav-link-open">Left Knee Sample Patient</a>
                        <div className="neon-green-line tiny center"></div>
                        <a href="#" className="nav-link w-nav-link w--nav-link-open">Right Hip Sample Patient</a>
                        <div className="neon-green-line tiny center"></div>
                        <a href="#" className="nav-link w-nav-link w--nav-link-open">Left Hip Sample Patient</a> */}
            {this.props.isAdmin() && (
              <section>
                {/* <div className="neon-green-line tiny center"></div>
                                <a href="/Manage" className="nav-link w-nav-link w--nav-link-open">Upload</a> */}
                <a
                  href="/AddUser"
                  className="nav-link w-nav-link w--nav-link-open"
                >
                  Add User
                </a>
                <div className="neon-green-line tiny center"></div>
                <a
                  href="/Defaults"
                  className="nav-link w-nav-link w--nav-link-open"
                >
                  Set Defaults
                </a>
                <div className="neon-green-line tiny center"></div>
                <a className="nav-link w-nav-link w--nav-link-open" href="/Csv">
                  Export to CSV
                </a>
                <div className="neon-green-line tiny center"></div>

                <a
                  href="/clear-database"
                  className="nav-link w-nav-link w--nav-link-open"
                >
                  Clear Database
                </a>

                <div className="neon-green-line tiny center"></div>
              </section>
            )}
            {this.props.isAuthenticated() && (
              <section>
                <a
                  className="nav-link w-nav-link w--nav-link-open"
                  onClick={() => {
                    this.props.logOut();
                    this.props.history.push("/Login");
                  }}
                >
                  Log Out
                </a>
              </section>
            )}
          </nav>
        </div>
      </div>
    );
  }
}

export default withRouter(Navigator);
