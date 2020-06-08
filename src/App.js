import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import {} from "react-bootstrap"
import Navigator from "./component/Navigator";
import { createBrowserHistory } from "history";
import Login from "./page/Login";
import Home from './page/HomeLeftRight';
import Upload from './page/Upload';
import Export from "./page/Export";
import { isAdmin } from './Firebase';
import { NotFound } from './page/NotFound';
import AddUser from './page/AddUser';
import Defaults from './page/Defaults';
const history = createBrowserHistory();
class App extends React.Component {
  
  requireAuth = (WrappedComponent, isLoggedIn, onAuth, isAdmin)=>{
    return class extends React.Component {
       render() {
        return isLoggedIn() ? (
           <WrappedComponent {...this.props} isAdmin={isAdmin()}/>
        ): (
          <Login {...this.props} onAuth={onAuth} />
        )
       }
      };    
  }

  requireAdmin = (WrappedComponent, isLoggedIn, onAuth, isAdmin)=>{
    return class extends React.Component {
       render() {
        return isLoggedIn() && isAdmin() ? (
           <WrappedComponent {...this.props} />
        ): (
          isLoggedIn() ? (
            <Redirect  to={{ pathname: '/'}} />
          ) :(
            <Login {...this.props} onAuth={onAuth} />
          )
        )
       }
      };    
  }  
  isAuthenticated=()=>{
    var user = JSON.parse(localStorage.getItem("userInfo"));
    return user && user.uid;
  }
  isAdmin=()=>{
    var user = JSON.parse(localStorage.getItem("userInfo"));
    if(user && user.uid){
      return isAdmin(user.uid);
    }
    else {
      return false;
    }
  }
  OnAuthSuccess = (user)=>{
    localStorage.setItem("userInfo", JSON.stringify(user));
    if(user && user.uid){
      history.push("/Home");
    }
  }
  OnLogout = ()=>{
    localStorage.removeItem("userInfo");
    history.push("/Login");
  }

  
  render(){
  return (        
    <Router history={history}>    
    <div className="">
      <Navigator isAuthenticated= {this.isAuthenticated} isAdmin={this.isAdmin} logOut={this.OnLogout}></Navigator>      
      <div className="main-container w-container">
      <Switch>
        <Route path="/" exact component={this.requireAuth(Home, this.isAuthenticated, this.OnAuthSuccess, this.isAdmin)} />
        <Route exact path="/Login" render={(routeProp)=><Login {...routeProp} onAuth={this.OnAuthSuccess} />} />
        <Route exact path="/Home" component={this.requireAuth(Home, this.isAuthenticated, this.OnAuthSuccess, this.isAdmin)} />
        <Route exact path="/Manage" component={this.requireAdmin(Upload, this.isAdmin, this.OnAuthSuccess, this.isAdmin)} />
        <Route exact path="/Csv" component={this.requireAdmin(Export, this.isAdmin, this.OnAuthSuccess, this.isAdmin)} />
        <Route exact path="/AddUser" component={this.requireAdmin(AddUser, this.isAdmin, this.OnAuthSuccess, this.isAdmin)} />
        <Route exact path="/Defaults" component={this.requireAdmin(Defaults, this.isAdmin, this.OnAuthSuccess, this.isAdmin)} />
        <Route exact path="*" component={NotFound} />
      </Switch>
      </div>
      <div className="copyright">© 2019 Hip &amp; Knee - Step by Step. All rights reserved.</div>
    </div>
    </Router>
  );
  }
}

export default App;
