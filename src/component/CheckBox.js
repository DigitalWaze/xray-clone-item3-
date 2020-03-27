import React from "react";
export class CheckBox extends React.Component{
    render(){
        return (
            <div className="photo-div">
                <div className={`white-circle ${this.props && this.props.default && !this.props.checked ? "gray":"" }`}  onClick={()=>{this.props.onChange(!this.props.checked)}}>
                {this.props && (this.props.checked || this.props.default) && (<img src={require("../assets/img/5d7986f8a637b348ccb2fdc8_5d261cbd528d2e4c51c05642_noun_Check_2422525_ffffff.png")}                             
                             sizes="(max-width: 767px) 26.02272605895996px, (max-width: 991px) 3vw, 26.02272605895996px" 
                             alt="" className={this.props.default ? "gray": ""} /> )}
                </div>                
            </div>
        );
    }
}