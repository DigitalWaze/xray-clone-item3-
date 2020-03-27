import React, {Component} from "react";
import {Authenticate, isAdmin, VerifyToken, IsStill} from "../Firebase";

export default class Login extends Component{
    constructor(props){
        super(props);

        this.state={
            email:"",
            password:""
        }
    }
    async componentWillMount(){        
        var user = JSON.parse(localStorage.getItem("userInfo"));
        if(user && user.uid){
            this.props.onAuth(user);
            this.props.history.push("/Home");            
        }
    }
    doLogin = async ()=> {
        if(this.state.email && this.state.password){
            let user = await Authenticate(this.state.email, this.state.password);
            if(user && user.uid){
                this.props.onAuth(user);
                this.props.history.push("/Home");
            }
            else {
                this.setState({msg:"Invalid user id or password"})
            }
        }
        else {
            this.setState({msg:"Please provide user id and password"})
        }
    }
    render(){
        return (
            <div className="w-row">
                <div className="w-col w-col-8">
                    <div className="container"></div>
                    <h1 className="heading">Hip &amp; Knee <br/>Step by Step</h1>
                    <div className="div2"></div>
                    <div className="top-header"></div>
                    <div className="w-form">
                        <div id="email-form" name="email-form" className="form-5 w-clearfix">
                            <div className="div-block-2">
                                <label className="field-label">User ID:</label>
                                <input type="text" className="text-field w-input" maxLength="256" name="name" id="name" 
                                onChange={(e)=>{this.setState({email: e.target.value})}} />                                    
                            </div>
                            <div className="div-block-2">
                                <label className="field-label">Password:</label>
                                <input type="Password" className="text-field w-input" maxLength="256" name="name-2" id="name-2" 
                                onChange={(e)=>{this.setState({password: e.target.value})}} />
                            </div>
                            {/* <a href="/sbs-x-ray-review" className="button-confirm form w-button">Login</a> */}
                            <input type="button" value="Login" className="button-confirm form w-button" onClick={this.doLogin} />
                        </div>
                        <div className="w-form-done">
                            <div>Thank you! Your submission has been received!</div>
                        </div>
                        {this.state.msg && (
                        <div className="w-form-fail" style={{display:"block"}}>
                            <div>{this.state.msg}</div>
                        </div>
                        )}
                    </div>
                </div>
                <div className="w-col w-col-4">
                    <img src={ require("../assets/img/5d78fef28f5b3e197ba9ceef_Bitmap.png")} alt="" className="image" />
                </div>
            </div>

        );
    }
}