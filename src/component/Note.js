import React from "react";
import { returnStatement } from "@babel/types";
export class Note extends React.Component{
    constructor(props){
        super(props);
        this.state={
            notes:"",
            notes0:"",
            notes1:"",
        }
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.notes!=this.props.notes)
        {
            if(this.props.EvalType=="Hip")
            {
                let rightNotes=this.props.notes[0];
                let leftNotes=this.props.notes[1];
                this.setState({notes0:rightNotes,notes1:leftNotes,notes:''})
                
            }
            else this.setState({notes:this.props.notes})
        }
    }

    componentDidMount()
    {
        if(this.props.EvalType=="Hip")
            {
                // let note=this.props.notes.split('\n')
                // let rightNote=""
                // let leftNote=""
                // if(note[0])
                // {
                //     rightNote=note[0]
                // }

                // if(note[1])
                // {
                //     rightNote=rightNote+'&#13;&#10;'+note[1]
                // }

                // if(note[2])
                // {
                //     leftNote=note[2]
                // }

                // if(note[3])
                // {
                //     leftNote=leftNote+'&#13;&#10;'+note[3]
                // }
                let rightNotes=this.props.notes[0];
                let leftNotes=this.props.notes[1];
                this.setState({notes0:rightNotes,notes1:leftNotes,notes:''})
                this.setState({notes0:rightNotes,notes1:leftNotes,notes:''})
                
            }
            else this.setState({notes:this.props.notes})
    }

    handleChangeNotes1 = (e) =>
    {
        let notes=e.target.value.split('\n');
        if(notes.length>2)
        {
            return;
        }
        else this.setState({notes1:e.target.value})
    } 

    handleChangeNotes0 = (e) =>
    {
        let notes=e.target.value.split('\n');
        if(notes.length>2)
        {
            return;
        }
        else this.setState({notes0:e.target.value})
    } 

    
    render(){
        return (
        <div className="email-popup" style={{opacity: 1, display: this.props.show ? "block" : "none"}}>
            <div className="columns no-border">
                <h4 className="notes">Notes: {this.props.EvalType==="Hip"?'Ap Hip':this.props.EvalType}</h4>
                <div className="w-form">
                    <form id="email-form" name="email-form">
                    
                        {this.props.EvalType==="Hip"?<span className="notes-right-hip-head" > Right Hip: </span>:null}
                    
                        {this.props.EvalType==="Hip"?<span className="notes-left-hip-head" > Left Hip: </span>:null}
                        
                        
                        {this.props.EvalType==="Hip"? <textarea id="Notes-2" name="Notes-2" maxLength="5000" 
                        className="textarea w-input" 
                        style={{margin: "5px 0px 25px", paddingTop:'20px',resize:'none',paddingBottom:'30px',paddingLeft:'105px', width: 461, height: '120px'}}
                        value={this.state.notes0}
                        onChange={(e)=>this.handleChangeNotes0(e)}
                        rows="2">
                            
                        
                        </textarea>:null}

                        {this.props.EvalType==="Hip"?<textarea id="Notes-2" name="Notes-2" maxLength="5000" 
                        className="textarea w-input" 
                        style={{margin: "5px 0px 25px",resize:'none',paddingTop:'25px',paddingBottom:'30px',paddingLeft:'90px', width: 461, height: '120px'}}
                        value={this.state.notes1}
                        onChange={(e)=>this.handleChangeNotes1(e)}
                        rows="2">
                            
                        
                        </textarea>:null}

                        {this.props.EvalType!=="Hip"?
                        <textarea id="Notes-2" name="Notes-2" maxLength="5000" 
                        className="textarea w-input" 
                        style={{resize:'none',margin: "5px 0px 25px",paddingBottom:'20px',paddingLeft:'25px', width: 461, height: 288}}
                        value={this.state.notes}
                        onChange={(e)=>this.setState({notes:e.target.value})}>
                            
                        
                        </textarea>:null}


                        <a className="button-confirm in-notes w-button" 
                            onClick={this.props.EvalType=="Hip"?()=>this.props.onSubmit([this.state.notes0,this.state.notes1]):()=>this.props.onSubmit(this.state.notes)}>Submit</a>
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