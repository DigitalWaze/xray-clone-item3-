import React from "react";
export class Note extends React.Component{
    constructor(props){
        super(props);
        this.state={
            notes:"",
        }
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.notes!=this.props.notes)
        {
            console.log('this')
            this.setState({notes:this.props.notes})
        }
    }

    componentDidMount()
    {
        console.log('setted')
        console.log(this.props.notes)
        this.setState({notes:this.props.notes})
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
                        value={this.state.notes}
                        onChange={(e)=>this.setState({notes:e.target.value})}></textarea>
                        <a className="button-confirm in-notes w-button" 
                            onClick={()=>this.props.onSubmit(this.state.notes)}>Submit</a>
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