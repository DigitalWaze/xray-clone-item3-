import React, { Component } from 'react';
import { getMyImage, getNewImage, saveImage, getImage, DeleteImage , DeleteCurrentImage,currentUser } from "../Firebase";
import LeftZone from '../assets/Left Hip.png'
import RightZone from '../assets/Right Hip.png'
import Zoom from "../component/Zoom";
import { CheckBox } from "../component/CheckBox";
import {Note} from "../component/Note";
// import SwipeableViews from 'react-swipeable-views';




export const rates = 
    [{name: "Normal/Slight", value: 1},
    {name: "Moderate", value: 2},
    {name: "NES", value: 3},
    {name: "End Stage", value: 4},
    {name: "Replaced", value: 5}];

class HipFrog extends Component {
    constructor(props) {
        super(props);
        this.state = { activeSide:null,FrogEval:null,left:null,EvalType:null,index:0 }

    }

    setComponentBack = () =>
    {
        let xray=this.props.xray;
        if(xray && xray.value ){

            let activeSide=null;
            let left=null;
            let FrogEval=false;
            let EvalType="Hip";

            if (xray.value.leftStatus==1)
            {
                activeSide="Left"
                left=false;
                if(xray.value.LeftFrog==true)
                {
                    FrogEval=true;
                }
            }

            else if(xray.value.rightStatus==1)
            {
                activeSide="Right"
                left=false;
                if(xray.value.RightFrog==true)
                {
                    FrogEval=true;
                }
            }

            else
            {
                // console.log('Set Compoe Back')
                activeSide="Left"
                left=true;
                if(xray.value.LeftFrog==true)
                {
                    FrogEval=true;
                }
            }
           

            this.setState({xray,activeSide,FrogEval,left,EvalType});
           
        }
        
        else{
            this.setState({xray,loading:false});
        }
    }

    setComponent = () =>
    {
        let xray=this.props.xray;
        if(xray && xray.value ){

            let activeSide=null;
            let left=null;
            let FrogEval=false;
            let EvalType="Hip";


            if(xray.value.rightStatus==1)
            {
                activeSide="Right"
                left=false;
                if(xray.value.RightFrog==true)
                {
                    FrogEval=true;
                }
            }

            else if (xray.value.leftStatus==1)
            {
                activeSide="Left"
                left=false;
                if(xray.value.LeftFrog==true)
                {
                    FrogEval=true;
                }
            }

            else
            {
                activeSide="Right"
                left=false;
                if(xray.value.RightFrog==true)
                {
                    FrogEval=true;
                }
            }
           

            this.setState({xray,activeSide,FrogEval,left,EvalType});
           
        }
        
        else{
            this.setState({xray,loading:false});
        }
    }
    componentWillMount()
    {
        this.setComponent();
    }

    toggleLateral = () =>
    {
        if(this.state.EvalType==="Lateral")
        {
            return;
        }
      
        this.setState({EvalType:"Lateral",left:true,index:1})
        
    }
    toggleHip = () =>
    {
        if(this.state.EvalType==="Hip")
        {
            return;
        }
        
        this.setState({EvalType:"Hip",left:false,index:0})
        
    }

    prevImage = async() =>
    {
        let xray = this.state.xray;
        if(xray.value.isError && xray.value.comment==="")
        {
            alert('Please add note about error');
            return;
        }
        else if(this.state.activeSide==="Left")
        {
            if(xray.value.rightStatus===1)
            {
                xray.value.rightStatus=2;
            }
            await this.saveChanges(xray.key, xray.value);
            let FrogEval=false;
            let EvalType="Hip";
            if(xray.value.RightFrog===true)
            {
                FrogEval=true;
            }

            this.setState({activeSide:"Right",FrogEval,left:false,EvalType,loading:false});
            return;
        }

        else if (this.state.activeSide==="Right")
        {
            await this.saveChanges();
            this.props.prevImage(); 
            this.setComponentBack();
        }
    }

    saveChanges = async () =>
    {
        let xray=this.state.xray;
        if(this.state.activeSide=="Right")
        {
            this.setState({loading:true});
            xray.value.rightStatus = 3;
            if(xray.value.leftStatus==3)
            {xray.value.status =3}
            xray.value.evaluatedOn = (new Date()).toJSON();
            xray.value.evaluator= currentUser().uid;
                
            xray.value.userName= currentUser().email.toString() || currentUser().userName.toString();
            
            await saveImage(xray.key, xray.value);


            this.setState({loading:false});
        }

        else if(this.state.activeSide=="Left") {

    
            this.setState({loading:true});
            localStorage.setItem("oldKey", xray.key);
            xray.value.isEvaluated=true;

            xray.value.leftStatus=3;
            if(xray.value.rightStatus==3)
            {xray.value.status =3}
            xray.value.evaluatedOn = (new Date()).toJSON();
            await saveImage(xray.key, xray.value);
            this.setState({loading:false});
            
        }

    }

    handleCheck = (checked, field, value) =>{
        let xray = this.state.xray;
        const activeTable = this.state.activeSide==="Right" ? this.state.EvalType==="Hip" ? "RightHipImage" : "RightFrogImage" : this.state.activeSide==="Left" ? this.state.EvalType==="Hip" ? "LeftHipImage" : "LeftFrogImage" : null;

        if(xray.value[activeTable].zone1==5)
        {
            xray.value[activeTable].zone1=""
            xray.value[activeTable].zone2=""
            xray.value[activeTable].zone3=""
        }

        xray.value[activeTable][field]= checked ?  value : null;
        this.setState({xray});
    }

    handleCheckAll = (checked, value) =>{
        let {xray} = this.state;
        const activeTable = this.state.activeSide==="Right" ? this.state.EvalType==="Hip" ? "RightHipImage" : "RightFrogImage" : this.state.activeSide==="Left" ? this.state.EvalType==="Hip" ? "LeftHipImage" : "LeftFrogImage" : null;
        xray.value[activeTable].zone1= checked ?  value : null;
        xray.value[activeTable].zone2= checked ?  value : null;
        xray.value[activeTable].zone3= checked ?  value : null;
        this.setState({xray});
    }

    nextImage = async () =>
    {
        let xray = this.state.xray;
        if(xray.value.isError && xray.value.comment==="")
        {
            alert('Please add note about error');
            return;
        }
        else if(this.state.activeSide=="Right")
        {
            if(xray.value.leftStatus===1)
            {
                xray.value.leftStatus = 2;
            }
            
            await this.saveChanges();
            let FrogEval=false;
            let EvalType="Hip";
            if(xray.value.LeftFrog===true)
            {
                FrogEval=true;
            }

            this.setState({activeSide:"Left",FrogEval,left:false,EvalType});
            return;
        }

        
        if(this.state.activeSide==="Left")
        {
           await this.saveChanges();
           this.props.nextImage(); 
           this.setComponent();
        }

    }
    render() { 
        const xray = this.state.xray;
        const lB = this.state.left;
        const global=this;
        const activeTable = this.state.activeSide==="Right" ? this.state.EvalType==="Hip" ? "RightHipImage" : "RightFrogImage" : this.state.activeSide==="Left" ? this.state.EvalType==="Hip" ? "LeftHipImage" : "LeftFrogImage" : null;
        function Table()
        {
            return(
                xray.value.Hip==true?
                <table className="tablet">
                <tbody>
                <tr>
                        <td  style={{verticalAlign:'bottom'}}></td>
                        <td colspan="3" style={{borderLeft:'1px solid white',borderRight:global.state.FrogEval===true?'1px solid white':null,verticalAlign:'bottom'}}>
                            <div style={{width:'calc(50% - 1px)',background:'',height:'70px',textAlign:'center',marginBottom:'-1px',verticalAlign:'bottom',display:'inline-block',borderTop:'1px solid white',borderRight:'1px solid white',borderBottom:lB?'1px solid white':null}}>
                                <a className="button-confirm w-button" onClick={global.toggleHip} style={{marginRight:30,borderWidth:!lB?3:0,borderColor:!lB?'white':'none',borderStyle:!lB?'solid':'none'}}>{global.state.activeSide} Hip</a>
                            </div>

                            {global.state.FrogEval===true?
                                <div style={{width:'50%',background:'',height:'70px',marginBottom:'-1px',verticalAlign:'bottom',display:'inline-block',borderBottom:!lB?'1px solid white':null,borderTop:'1px solid white'}}>
                                    <a className="button-confirm w-button" onClick={global.toggleLateral} style={{ marginLeft:30,borderWidth:lB?3:0,borderColor:lB?'white':'none',borderStyle:lB?'solid':'none'}}>{global.state.activeSide} Lateral</a>
                                </div>
                            :
                                <div style={{width:'50%',display:'inline-block',height:'57px',marginBottom:'-1px',verticalAlign:'bottom',borderBottom:'1px solid white'}}>
                                    
                                </div>
                            } 
                            
                        </td>
                        
                    
                        
                    </tr>

                    <tr style={{borderLeft:'1px solid white'}}>
                        <td style={{borderTop:'1px solid white',verticalAlign:'bottom'}}></td>
                        <td>
                                <p className="table-text c">Zone 1</p>
                        </td>
                        <td >
                                <p className="table-text c">Zone 2</p>
                        </td>
                        <td style={{borderRight:'1px solid white'}}>
                                <p className="table-text c">Zone 3</p>
                        </td>
                        <td>
                            <a  className="view-report button-7 w-button"
                                onClick={()=>{
                                    xray.value.isError = true;
                                    global.setState({addNote:true, xray})
                                }}>X-ray Error
                            </a>
                        </td>
                    </tr>
                    {rates.map(i=>
                        (<tr key={i.value} style={{borderLeft:'1px solid white'}}>
                            <td style={{verticalAlign:"bottom"}}>
                                <p className="table-text">{i.name}</p>
                                </td>
                               
                                {
                                    i.value<5?
                                    <td><CheckBox checked={xray.value[activeTable].zone1===i.value} 
                                    onChange={(checked)=>{global.handleCheck(checked, "zone1", i.value)}}/></td>
                                    :
                                    <td><span style={{display:'inline-block',borderBottom:'1px white solid',height:'41px',width:'100%',verticalAlign:"bottom"}}> </span></td>
                                }
                                {
                                    i.value<5?
                                    <td><CheckBox checked={xray.value[activeTable].zone2===i.value} 
                                    onChange={(checked)=>{global.handleCheck(checked, "zone2", i.value)}}/></td>:
                                    
                                    <td><CheckBox checked={xray.value[activeTable].zone1===i.value}
                                    onChange={(checked)=>{global.handleCheckAll(checked,  i.value)}}/></td>
                                }
                                {
                                    i.value<5?
                                    <td  style={{borderRight:'1px solid white'}}><CheckBox checked={xray.value[activeTable].zone3===i.value} 
                                    onChange={(checked)=>{global.handleCheck(checked, "zone3", i.value)}}/></td>:
                                    <td><span style={{display:'inline-block',borderBottom:'1px white solid',height:'41px',width:'calc(100% + 1px)',verticalAlign:"bottom", borderRight:'1px solid white'}}> </span></td>
                                }
                            
                            <td>

                                {i.value===5 && (<a href="#" className="view-report button-7 green w-button"
                                    onClick={()=>global.setState({addNote:true})}>Add Note</a>)}
                                {/* {i.value===3 && (<a href="#" className="view-report button-7 red w-button"
                                    onClick={this.delete}>Delete</a>)} */}
                            </td>
                        </tr>)
                    )}
                </tbody>
            </table>
            :null
            )
        }
        
        if(xray!=null)return ( 
            
        <div>
            <div style={{display:'block',height:'280px'}}>
            {
                this.state.activeSide==='Right'?
                <span style={{width:'25%',display:"inline-block",verticalAlign:'top',marginRight:'9%'}}>
                    <img src={RightZone}  alt="ZONES" style={{width:'100%',height:220,borderWidth:3,borderColor:'white',borderStyle:'solid'}}/>
                </span>
                :this.state.activeSide==='Left'?
                <span style={{width:'25%',display:"inline-block",verticalAlign:'top',marginRight:'9%'}}>
                    <img src={LeftZone}  alt="ZONES" style={{width:'100%',height:220,borderWidth:3,borderColor:'white',borderStyle:'solid'}}/>
                </span>
                :null
            }
            {xray.value.Hip===true?
                <span style={{width:'31%',display:"inline-block",marginRight:'2%'}}>
                    <Zoom src={xray.value.HipImage.imageUrl.imageUrl} active={this.state.EvalType==="Hip"} style={{width:'100%'}}/>
                </span>
                :null 
            }
                          
            
            {
                this.state.FrogEval===true && this.state.activeSide==="Right"?
                    <span style={{width:'31%',display:"inline-block",marginRight:'2%'}}>
                        <Zoom src={xray.value.RightFrogImage.imageUrl.imageUrl} active={this.state.EvalType==="Lateral"} style={{width:'100%'}}/>
                    </span>
                :this.state.FrogEval===true && this.state.activeSide==="Left"?
                    <span style={{width:'31%',display:"inline-block",marginRight:'2%'}}>
                        <Zoom src={xray.value.LeftFrogImage.imageUrl.imageUrl} active={this.state.EvalType==="Lateral"}  style={{width:'100%'}}/>
                    </span>
                :null
            }

            </div>
            {/* <div>
                <a className="button-confirm w-button" onClick={this.toggleHip} style={{marginRight:30,borderWidth:!lB?3:0,borderColor:!lB?'white':'none',borderStyle:!lB?'solid':'none'}}>{this.state.activeSide} Hip</a>
                {this.state.FrogEval===true? <a className="button-confirm w-button" onClick={this.toggleLateral} style={{ marginLeft:30,borderWidth:lB?3:0,borderColor:lB?'white':'none',borderStyle:lB?'solid':'none'}}>{this.state.activeSide} Lateral</a>:null}
            </div> */}

           <div>
            <Table />
           </div>
            
             

            
            <a className="button-confirm w-button" onClick={this.prevImage} style={{position:"fixed", left:50, bottom:20}}>Back</a>
            <a className="button-confirm w-button" onClick={this.nextImage} style={{position:"fixed", left:"auto", right:50, bottom:20}}> Next </a >

            <Note show={this.state.addNote} onSubmit={(value)=>{
            xray.value.comment = value;
            this.setState({addNote:false, xray})
            }} onCancel={()=>{
                xray.value.isError= false;
                this.setState({addNote:false, xray})
                }} 
            />

        </div> );

        else return(<div></div>)
    }
}
 
export default HipFrog;