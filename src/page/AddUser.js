import React from "react";
import { Register, GetAllUser } from "../Firebase";

export default class AddUser extends React.Component {
    constructor(props){
        super(props);
        this.state={       
            users: []     
        }
    }
    componentDidMount(){
      this.getUsers();
    }
    getUsers = ()=>{
        // var users = GetAllUser();
        // this.setState({users});
    }
    addUser = async ()=>{
        let {email, password, cpassword} = this.state;
        if(email && password && password===cpassword){
            try {
                await Register(email, password);
                this.getUsers();
                alert("User created successfully");
                this.setState({email:"", password:"", cpassword:""});
            }catch(err){
                alert(err.message)
            }
        }
        else {
            if(password!==cpassword){
                alert("Password mismatch");
            }
            else {
                alert("Please enter required field");
            }
        }
    }
    render(){
        return (        
            <section>
                 <div className="w-row">
                    <div className="column-5 w-col w-col-12">
                        <button className="button-confirm w-button" onClick={()=>{
                            this.props.history.push("/Home");
                        }}> Evaluate</button>                    
                    </div>  
                </div>            
            <div className="w-row">
                <div className="w-col w-col-7">
                    <div className="container"></div>
                    <h1 className="heading">Create User</h1>
                    <div className="div2"></div>
                    <div className="top-header"></div>
                    <div className="w-form">
                        <div id="email-form" name="email-form" className="w-clearfix">
                            <div className="div-block-2">
                                <label className="field-label">User ID:</label>
                                <input type="text" className="text-field w-input" maxLength="256" name="name" id="name" 
                                value={this.state.email}
                                onChange={(e)=>{this.setState({email: e.target.value})}} />                                    
                            </div>
                            <div className="div-block-2">
                                <label className="field-label">Password:</label>
                                <input type="Password" className="text-field w-input" maxLength="256" name="name-2" id="name-2" 
                                value={this.state.password}
                                onChange={(e)=>{this.setState({password: e.target.value})}} />
                            </div>
                            <div className="div-block-2">
                                <label className="field-label">Confirm Password:</label>
                                <input type="Password" className="text-field w-input" maxLength="256" name="name-2" id="name-2" 
                                value={this.state.cpassword}
                                onChange={(e)=>{this.setState({cpassword: e.target.value})}} />
                            </div>
                            {/* <a href="/sbs-x-ray-review" className="button-confirm form w-button">Login</a> */}
                            <input type="button" value="Create" className="button-confirm form w-button" onClick={this.addUser} />
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
                {/* <div className="w-col w-col-5">
                    <table>
                        {this.state.users && this.state.users.map(i=>(
                            <tr>
                                <td>{i.value.email}</td>
                            </tr>
                        ))}
                    </table>
                </div>            */}
            </div>
            </section>    
        );
    }
}