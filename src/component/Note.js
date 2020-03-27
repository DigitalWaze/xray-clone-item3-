import React from "react";
export class Note extends React.Component{
    constructor(props){
        super(props);
        this.state={
            note:""
        }
    }
    render(){
        return (
        <div className="email-popup" style={{opacity: 1, display: this.props.show ? "block" : "none"}}>
            <div className="columns no-border">
                <h4 className="notes">Notes</h4>
                <div className="w-form">
                    <form id="email-form" name="email-form">
                        <textarea id="Notes-2" name="Notes-2" maxLength="5000" 
                        className="textarea w-input" 
                        style={{margin: "5px 0px 25px", width: 461, height: 288}}
                        onChange={(e)=>this.setState({note:e.target.value})}></textarea>
                        <a className="button-confirm in-notes w-button" 
                            onClick={()=>this.props.onSubmit(this.state.note)}>Submit</a>
                        <a className="button-confirm in-notes cancel w-button" 
                            onClick={this.props.onCancel}>No Notes</a>
                    </form>
                    <div className="w-form-done">
                        <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div className="w-form-fail">
                        <div>Oops! Something went wrong while submitting the form.</div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}