import React, {Component} from "react";
import { CheckBox } from "../component/CheckBox";
import {Note} from "../component/Note";
import { getMyImage, getNewImage, saveImage, getImage, DeleteCurrentImage } from "../Firebase";
import {Loader} from "../component/Loader";
import Zoom from "../component/Zoom";

export const rates = [{name: "Normal/Slight", value: 1},
                    {name: "Moderate", value: 2},
                    {name: "NES", value: 3},
                    {name: "End Stage", value: 4},
                    {name: "Replaced", value: 5}];

export default class Home extends Component{

    constructor(props){
        super(props);
        this.state={
            addNote:false,
            xray: { key:"", value:{}},
            isLoading: true,
            rightButton:true,
            leftButton:false,
            leftSide:true,rightSide:true,
            ImageleftSide:true,ImagerightSide:true
        }
    }

    async componentDidMount(){
        let xray = await getMyImage();
        if(xray == null || xray.value == null){
            var oldkey = localStorage.getItem("oldKey") || "";
            xray =  await getNewImage(oldkey);
            if(xray && xray.value && !xray.value.backImage){
                xray.value.backImage = oldkey;
            }
        }

        this.setState({xray,isLoading:false});

    }

    delete = async () =>{
        if(window.confirm("Are you sure you want to delete this?")){
            this.setState({isLoading:true});
            let {xray} = this.state;
            localStorage.setItem("oldKey", xray.value.backImage);
            await DeleteCurrentImage(xray.value.imageName, xray.key);
            xray =  await getNewImage(xray.value.backImage);
            if(xray && xray.value){
                xray.value.backImage =localStorage.getItem("oldKey");
            }
            this.setState({xray, isLoading:false});
        }
    }

    handleCheck = (checked, field, value) =>{
        let {xray} = this.state;
        xray.value[field] = checked ?  value : null;
        this.setState({xray});
    }

    nextImage = async ()=>{
        let {xray} = this.state;

        await this.saveChanges();
        if(xray && xray.value && xray.value.nextImage){
            xray = await getImage(xray.value.nextImage);           
        }
        else {
            xray = await getNewImage(xray.key);
            if(xray && xray.value){
                xray.value.backImage =localStorage.getItem("oldKey");
            }
        }
        this.setState({xray});
    }

    saveChanges= async ()=>{
        let {xray} = this.state;
        xray.value.rightLateral = xray.value.rightLateral || xray.value.d_rightLateral;
        xray.value.leftLateral = xray.value.leftLateral || xray.value.d_leftLateral;
        xray.value.rightMedial = xray.value.rightMedial || xray.value.d_rightMedial;
        xray.value.leftMedial = xray.value.leftMedial || xray.value.d_leftMedial;

        if((xray.value.rightLateral && xray.value.rightMedial
                && xray.value.leftLateral && xray.value.leftMedial) || (xray.value.isError && xray.value.comment!=="")){
                
                this.setState({isLoading:true});
                localStorage.setItem("oldKey", xray.key);
               
                xray.value.isEvaluated=true;
                xray.value.status =3;
                xray.value.evaluatedOn = (new Date()).toJSON();
                await saveImage(xray.key, xray.value);
               

                this.setState({isLoading:false});
        }
        else{
             alert("Please select all fields");
        }
    }

    prevImage = async ()=>{
        let {xray} = this.state;
        await this.saveChanges();
        if(xray && xray.value && xray.value.backImage){
            xray = await getImage(xray.value.backImage);

            this.setState({xray});
        }
    }
    rightHip =()=>{
this.setState({
    rightButton:true,
    leftButton:false,
    ImagerightSide:true
})
    }
    leftHip =()=>{
        this.setState({
            leftButton:true,
            rightButton:false,
            ImagerightSide:false
        })
            }
    render (){
        let {xray, isLoading} = this.state;
        const rB = this.state.rightButton;
        const lB = this.state.leftButton;
        if(xray==null || xray.value==null){
            return (
                <section>
                     {this.props.isAdmin && (
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }} style={{position:"fixed", top:20, right:50, left:"auto", bottom:"auto"}}> Upload</button>)}
                    <h2>No Data Found</h2>
                </section>
            );
        }

        return (
        
        <section>
            <Loader loading={isLoading}/>
            {/* {this.props.isAdmin && (<div className="w-row">
                <div className="column-5 w-col w-col-12">
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }}> Upload</button>
                </div>
            </div>)} */}

            {this.props.isAdmin && (
                    <button className="button-confirm w-button" onClick={()=>{
                        this.props.history.push("/Manage");
                    }} style={{position:"fixed", top:20, right:50, left:"auto", bottom:"auto"}}> Upload</button>)}
            <div className="columns-6 w-row">
                <div className="column-right-padding w-col w-col-7">
                    <h3 className="heading-4">SBS X-ray Review</h3>
                </div>
                <div className="w-col w-col-5">
                    <p className="small-paragraph">X-ray Name: {xray.value.imageName}</p>
                </div>
            </div>
            <div className="columns-2 w-row">

             {/* RIGHT SIDE FROG */}
                {
this.state.rightSide?
                    <img src={xray.value.imageUrl} style={{width:'30%',height:220,borderWidth:rB?3:0,borderColor:rB?'white':'none',borderStyle:rB?'solid':'none'}}/>
                :null
                }
                {/* RIGHT SIDE FROG END*/}

                {/* RIGHT SIDE XRAY */}
                {
this.state.rightSide?
            <img src={xray.value.imageUrl} style={{width:'20%',height:200,marginRight:0,marginLeft:'2%'}}/>
            :null
        }
            {/* RIGHT SIDE XRAY END*/}

            {/* LEFT SIDE XRAY */}
            {
             this.state.ImageleftSide?   
                <img src={xray.value.imageUrl} style={{width:'20%',height:200,marginRight:'2%',marginLeft:!this.state.rightSide?'50%':0}}/>
            :null}
            {/* LEFT SIDE XRAY END*/}

            {/* leFT SIDE FROG */}
            {
this.state.leftSide?
            <img src={xray.value.imageUrl} style={{width:'30%',height:220,borderWidth:!this.state.ImagerightSide && this.state.ImageleftSide?3:0,borderColor:!this.state.ImagerightSide && this.state.ImageleftSide?'white':'none',borderStyle:!this.state.ImagerightSide && this.state.ImageleftSide?'solid':'none'}}/>
            :null
                }
                            {/* leFT SIDE FROG END*/}
                </div>
            {/* <img src={xray.value.imageUrl}  alt="" className="big-xray" /> */}
            {/* //  onClick={()=>this.setState({zoom:true})}/> */}
            {/* {xray.value && xray.value.imageUrl && (<ReactImageZoom width={500} height={400} offset={{vertical:200, horizontal:300}} zoomWidth={500} img={xray.value.imageUrl} />)} */}
            {/* <div className="columns-2 w-row"> */}
            {
this.state.rightSide && this.state.leftSide?
<div>
                <a className="button-confirm w-button" onClick={this.rightHip} style={{marginRight:30,borderWidth:rB?3:0,borderColor:rB?'white':'none',borderStyle:rB?'solid':'none'}}>Right Hip</a>
            <a className="button-confirm w-button" onClick={this.leftHip} style={{ marginLeft:30,borderWidth:lB?3:0,borderColor:lB?'white':'none',borderStyle:lB?'solid':'none'}}>Left Hip</a>
</div>
            :null}
                {/* </div> */}

                
               <table className="tablet">
                   <tbody>
                   <tr>
                       <td></td>
                       <td>
                            <p className="table-text c">Right Lateral</p>
                        </td>
                       <td >
                            <p className="table-text c">Right Medial</p>
                       </td>
                       <td>
                            <p className="table-text c">Left Medial</p>
                        </td>
                       <td>
                            <p className="table-text c">Left Lateral</p>
                        </td>
                       <td>
                           <a  className="view-report button-7 w-button"
                            onClick={()=>{
                                xray.value.isError = true;
                                this.setState({addNote:true, xray})
                                }}>X-ray Error</a>
                        </td>
                   </tr>
                   {rates.map(i=>
                    (<tr key={i.value}>
                       <td style={{verticalAlign:"bottom"}}>
                           <p className="table-text">{i.name}</p>
                        </td>
                       <td><CheckBox checked={xray.value.rightLateral===i.value} default={xray.value.d_rightLateral===i.value}
                            onChange={(checked)=>{this.handleCheck(checked, "rightLateral", i.value)}}/></td>
                       <td><CheckBox checked={xray.value.rightMedial===i.value} default={xray.value.d_rightMedial===i.value}
                            onChange={(checked)=>{this.handleCheck(checked, "rightMedial", i.value)}}/></td>
                       <td><CheckBox checked={xray.value.leftMedial===i.value} default={xray.value.d_leftMedial===i.value}
                            onChange={(checked)=>{this.handleCheck(checked, "leftMedial", i.value)}}/></td>
                       <td><CheckBox checked={xray.value.leftLateral===i.value} default={xray.value.d_leftLateral===i.value}
                            onChange={(checked)=>{this.handleCheck(checked, "leftLateral", i.value)}}/></td>
                       <td>

                        {i.value===5 && (<a href="#" className="view-report button-7 green w-button"
                            onClick={()=>this.setState({addNote:true})}>Add Note</a>)}
                        {i.value===3 && (<a href="#" className="view-report button-7 red w-button"
                            onClick={this.delete}>Delete</a>)}
                       </td>
                   </tr>)
                   )}
                   </tbody>
               </table>

               {/* <div className=" w-row">
                   <div className="column-right-padding w-col w-col-7">
                       <a className="button-confirm w-button" onClick={this.prevImage}>Back</a>
                    </div>
                    <div className="column-4 w-col w-col-5">
                        <a className="button-confirm w-button" onClick={this.nextImage}>Next</a>
                    </div>
                </div> */}
                <a className="button-confirm w-button" onClick={this.prevImage} style={{position:"fixed", left:50, bottom:20}}>Back</a>
                <a className="button-confirm w-button" onClick={this.nextImage} style={{position:"fixed", left:"auto", right:50, bottom:20}}>Next</a>
                <Note show={this.state.addNote} onSubmit={(value)=>{
                    xray.value.comment = value;
                    this.setState({addNote:false, xray})
                    }} onCancel={()=>{
                        xray.value.isError= false;
                        this.setState({addNote:false, xray})
                        }} />

                {/* <div className="email-popup img-full-size"  style={{display: this.state.zoom ? "block" : "none"}}>
                    <div className="circle-btn" onClick={()=>this.setState({zoom:false})}>X</div>                    
                    <img src={xray.value.imageUrl} alt="xray"/>                    
                </div> */}
        </section>
        );
    }
}


