import React from "react";

export const Loader = (props)=>{
    if(props.loading){
        return (
            <div className="overlay">
                <div className="loader"></div>
            </div>
        );
    }
    else {
        return null;
    }
}